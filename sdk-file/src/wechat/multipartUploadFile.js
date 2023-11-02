const constants = require('core-module/constants')
const HError = require('core-module/HError')
const utils = require('core-module/utils')
const storage = require('core-module/storage')
const dayjs = require('dayjs')
const { multipartUpload } = require('core-module/upload')
const SparkMD5 = require('spark-md5')

const storageKey = constants.STORAGE_KEY.MULTIPART_UPLOAD
const { getAuthorization, init, complete } = multipartUpload

const createFileChunks = async fileParams => {
  const chunkSize = 1 * 1024 * 1024 // 又拍云限制每次只能上传 1MB
  const readFileAsync = utils.promisify(wx.getFileSystemManager().readFile)

  let current = 0
  let chunks = [] // 保存与返回所有切片的参数

  while (current < fileParams.fileSize) {
    // 文件进行切片
    const length = Math.min(fileParams.fileSize - current, chunkSize)

    const chunk = await readFileAsync({
      filePath: fileParams.filePath,
      position: current,
      length,
    })

    chunks.push({ data: chunk.data, length })
    current = current + chunkSize
  }

  return chunks
}

const multipartStorage = {
  get: key => {
    const currentValue = storage.get(storageKey) || {}
    return currentValue[key]
  },
  set: (key, value) => {
    const currentValue = storage.get(storageKey) || {}
    storage.set(storageKey, {
      ...currentValue,
      [key]: {
        ...(currentValue[key] ? currentValue[key] : {}),
        ...value,
      },
    })
  },
  delete: key => {
    const currentValue = storage.get(storageKey) || {}
    delete currentValue[key]
    storage.set(storageKey, currentValue)
  },
}

/**
 * 上传大文件。
 * @memberof BaaS
 * @param {FileParams} fileParams 文件参数
 * @param {FileMeta} metaData 文件元信息
 * @param {string} type 文件类型
 * @return {Promise<any>}
 */
const multipartUploadFile = (fileParams, metaData) => {
  if (
    !fileParams ||
    typeof fileParams !== 'object' ||
    !fileParams.filePath ||
    !fileParams.fileSize
  ) {
    throw new HError(605)
  }

  if (
    fileParams.fileName !== undefined &&
    typeof fileParams.fileName !== 'string'
  ) {
    throw new HError(605)
  }

  if (!metaData) {
    metaData = {}
  } else if (typeof metaData !== 'object') {
    throw new HError(605)
  }

  const getUploadRecord = md5 => {
    const now = dayjs()
    const uploadRecord = multipartStorage.get(md5) || {}

    if (!uploadRecord.init_time) return null

    if (now.diff(dayjs(uploadRecord.init_time), 'hour') < 24) {
      return uploadRecord
    }

    return null
  }

  let rs, rj, uploadCallback = null
  // isAborted

  let p = new Promise((resolve, reject) => {
    rs = resolve
    rj = reject
  })

  function onProgressUpdate(cb) {
    uploadCallback = cb
  }

  function mix(obj) {
    return Object.assign(obj, {
      catch(...args) {
        let newPromise = Promise.prototype.catch.call(this, ...args)
        mix(newPromise)
        return newPromise
      },
      then(...args) {
        let newPromise = Promise.prototype.then.call(this, ...args)
        mix(newPromise)
        return newPromise
      },
      onProgressUpdate,
    })
  }

  mix(p)

  const wxRequest = utils.promisify(wx.request)

  createFileChunks(fileParams).then(async chunks => {
    const md5 = SparkMD5.ArrayBuffer.hash(chunks)

    const initMultipartUpload = async () => {
      const uploadRecord = getUploadRecord(md5)

      // 有上传记录，则续传
      if (uploadRecord) {
        const res = await getAuthorization(uploadRecord.id)
        const initConfig = { ...res.data, ...uploadRecord }
        return initConfig
      }

      const filename =
        fileParams.fileName || utils.getFileNameFromPath(fileParams.filePath)
      const data = { file_size: fileParams.fileSize, filename }
      const res = await init(data, utils.replaceQueryParams(metaData))
      const initConfig = res.data

      // 超时或者初始上传，都重新设置新值
      multipartStorage.set(md5, {
        init_time: new Date().getTime(),
        multi_part_id: +initConfig.multi_part_id,
        multi_uuid: initConfig.multi_uuid,
        upload_url: initConfig.upload_url,
        id: initConfig.id,
      })

      return initConfig
    }

    const multipartUpload = async data => {
      const _chunks = chunks.slice(data.multi_part_id)
      let uuid = data.multi_uuid
      let nextPartId = data.multi_part_id

      if (uploadCallback) {
        uploadCallback({
          progress: Math.floor((nextPartId / chunks.length) * 100),
        })
      }

      const uploadChunk = async chunk => {
        const res = await wxRequest({
          url: data.upload_url,
          method: 'PUT',
          data: chunk.data,
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': chunk.length,
            Authorization: data.authorization,
            'x-date': data.date,
            'x-upyun-multi-stage': 'upload',
            'x-upyun-multi-uuid': uuid,
            'x-upyun-part-id': nextPartId,
          },
        })

        const stringifiedStatusCode = res.statusCode + ''

        if (!stringifiedStatusCode.startsWith('2')) {
          // 如果是 authorization 超时 30 分钟，则需重新获取
          if (res && res.data && res.data.code === 40100002) {
            const uploadRecord = getUploadRecord(md5)
            const res = await getAuthorization(uploadRecord.id)
            data.authorization = res.data.authorization
            data.date = res.data.date
            return await uploadChunk(chunk)
          }

          throw res
        }

        return res
      }

      for (let chunk of _chunks) {
        const res = await uploadChunk(chunk)

        uuid = res.header['x-upyun-multi-uuid']
        nextPartId = res.header['x-upyun-next-part-id']

        multipartStorage.set(md5, {
          multi_part_id: +nextPartId,
          multi_uuid: uuid,
        }) // 保存当前上传记录

        if (nextPartId == -1) break

        if (uploadCallback) {
          uploadCallback({
            progress: Math.floor((nextPartId / chunks.length) * 100),
          })
        }
      }

      return { file: data, multi_uuid: uuid }
    }

    const completeMultipartUpload = async data => {
      const uploadRecord = getUploadRecord(md5)

      return complete(uploadRecord.id, data.multi_uuid).then(res => {
        if (res.data.upload_status !== 'success') {
          throw new HError(617)
        }

        multipartStorage.delete(md5) // 上传成功，删除上传记录

        if (uploadCallback) {
          uploadCallback({ progress: 100 })
        }

        return {
          data: {
            status: 'ok',
            path: data.file.path,
            file: {
              id: data.file.id,
              path: data.file.path,
              name: data.file.name,
              created_at: data.file.created_at,
              // mime_type: fileObj.type, // 又拍云没有提供
              cdn_path: data.file.cdn_path,
              size: fileParams.fileSize,
            },
          },
        }
      })
    }

    try {
      const initConfig = await initMultipartUpload()
      const data = await multipartUpload(initConfig)
      const result = await completeMultipartUpload(data)
      return rs(result)
    } catch (error) {
      // 没有 statusCode 返回，一般是网络问题，不做删除处理
      if (!error.statusCode) {
        rj(new HError(600))
      }

      multipartStorage.delete(md5) // 上传成功，删除上传记录
      rj(error)
    }
  }, rj)

  return p
}

module.exports = multipartUploadFile
