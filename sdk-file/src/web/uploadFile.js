const axios = require('axios')
const constants = require('core-module/constants')
const HError = require('core-module/HError')
const utils = require('core-module/utils')
const { getUploadFileConfig, multipartUpload } = require('core-module/upload')
const SparkMD5 = require('spark-md5')
const storage = require('core-module/storage')
const dayjs = require('dayjs')
require('regenerator-runtime/runtime')

const storageKey = constants.STORAGE_KEY.MULTIPART_UPLOAD
const { getAuthorization, init, complete } = multipartUpload

const createFileChunks = file => {
  const chunkSize = 1 * 1024 * 1024 // 又拍云限制每次只能上传 1MB

  let current = 0
  let chunks = [] // 保存与返回所有切片的参数

  while (current < file.size) {
    // 文件进行切片
    const chunk = file.slice(current, current + chunkSize)
    chunks.push(chunk)
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

module.exports = function (BaaS) {
  /**
   * 上传文件。
   * @memberof BaaS
   * @param {FileParams} fileParams 文件参数
   * @param {FileMeta} metaData 文件元信息
   * @return {Promise<any>}
   */
  BaaS.uploadFile = function (fileParams, metaData) {
    let fileObj = fileParams.fileObj
    if (!fileObj || typeof fileObj !== 'object' || !fileObj.name) {
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

    let config = {}
    let fileName = fileParams.fileName || fileObj.name
    return getUploadFileConfig(fileName, utils.replaceQueryParams(metaData))
      .then(res => {
        config = {
          id: res.data.id,
          fileName: fileName,
          policy: res.data.policy,
          authorization: res.data.authorization,
          uploadUrl: res.data.upload_url,
          filePath: fileObj.name,
          destLink: res.data.path,
        }

        let fd = new FormData()
        fd.append(constants.UPLOAD.UPLOAD_FILE_KEY, fileObj, fileName)
        fd.append('policy', config.policy)
        fd.append('authorization', config.authorization)

        return axios.post(config.uploadUrl, fd)
      })
      .then(res => {
        let result = {}
        let data = res.data
        result.status = 'ok'
        result.path = config.destLink
        result.file = {
          id: config.id,
          path: config.destLink,
          name: config.fileName,
          created_at: data.time,
          mime_type: data.mimetype,
          cdn_path: data.url,
          size: data.file_size,
        }
        res.data = result
        return res
      })
  }

  /**
   * 上传大文件（断点续传）。
   * @memberof BaaS
   * @param {FileParams} fileParams 文件参数
   * @param {FileMeta} metaData 文件元信息
   * @return {Promise<any>}
   */
  BaaS.multipartUploadFile = async function (fileParams, metaData) {
    const { fileObj, fileName } = fileParams
    if (!fileObj || typeof fileObj !== 'object' || !fileObj.name) {
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

    const chunks = createFileChunks(fileObj)
    const md5 = SparkMD5.ArrayBuffer.hash(chunks)

    const getUploadRecord = () => {
      const now = dayjs()
      const uploadRecord = multipartStorage.get(md5) || {}

      if (!uploadRecord.init_time) return null

      if (now.diff(dayjs(uploadRecord.init_time), 'hour') < 24) {
        return uploadRecord
      }

      return null
    }

    const initMultipartUpload = async () => {
      const uploadRecord = getUploadRecord()

      // 有上传记录，则续传
      if (uploadRecord) {
        const res = await getAuthorization(uploadRecord.id)
        const initConfig = { ...res.data, ...uploadRecord }
        return initConfig
      }

      const filename = fileName || fileObj.name
      const data = { file_size: fileObj.size, filename }
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

      const uploadChunk = async chunk => {
        try {
          return await axios.put(data.upload_url, chunk, {
            headers: {
              Authorization: data.authorization,
              'x-date': data.date,
              'x-upyun-multi-stage': 'upload',
              'x-upyun-multi-uuid': uuid,
              'x-upyun-part-id': nextPartId,
            },
          })
        } catch (error) {
          // 如果是 authorization 超时 30 分钟，则需重新获取
          if (error && error.data && error.data.code === 40100002) {
            const uploadRecord = getUploadRecord()
            const res = await getAuthorization(uploadRecord.id)
            data.authorization = res.data.authorization
            data.date = res.data.date
            return await uploadChunk(chunk)
          }
          throw error
        }
      }

      for (let chunk of _chunks) {
        const res = await uploadChunk(chunk)

        uuid = res.headers['x-upyun-multi-uuid']
        nextPartId = res.headers['x-upyun-next-part-id']

        multipartStorage.set(md5, {
          multi_part_id: +nextPartId,
          multi_uuid: uuid,
        }) // 保存当前上传记录

        if (nextPartId === -1) break
      }

      return { file: data, multi_uuid: uuid }
    }

    const completeMultipartUpload = async data => {
      const uploadRecord = getUploadRecord()

      return complete(uploadRecord.id, data.multi_uuid).then(res => {
        if (res.data.upload_status !== 'success') {
          throw new HError(617)
        }

        multipartStorage.delete(md5) // 上传成功，删除上传记录
        return {
          data: {
            status: 'ok',
            path: data.file.path,
            file: {
              id: data.file.id,
              path: data.file.path,
              name: data.file.name,
              created_at: data.file.created_at,
              mime_type: fileObj.type,
              cdn_path: data.file.cdn_path,
              size: fileObj.size,
            },
          },
        }
      })
    }

    try {
      const initConfig = await initMultipartUpload()
      const data = await multipartUpload(initConfig)
      return await completeMultipartUpload(data)
    } catch (error) {
      // 没有 error 返回，一般是网络问题，不做删除处理
      if (!error) {
        throw new HError(600)
      }

      multipartStorage.delete(md5) // 上传成功，删除上传记录
      throw error
    }
  }
}
