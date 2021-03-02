const BaaS = require('core-module/baas')
const constants = require('core-module/constants')
const HError = require('core-module/HError')
const utils = require('core-module/utils')
const {getUploadFileConfig, getUploadHeaders} = require('core-module/upload')

const swanUpload = (header, config, resolve, reject, type) => {
  return swan.uploadFile({
    url: config.uploadUrl,
    filePath: config.filePath,
    name: constants.UPLOAD.UPLOAD_FILE_KEY,
    formData: {
      authorization: config.authorization,
      policy: config.policy
    },
    header,
    success: (res) => {
      let result = {}
      // 开发者工具返回的 res.data 类型是 string，而真机返回 object
      let data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data

      result.status = 'ok'
      result.path = config.destLink
      result.file = {
        'id': config.id,
        'path': config.destLink,
        'name': config.fileName,
        'created_at': data.time,
        'mime_type': data.mimetype,
        'cdn_path': data.url,
        'size': data.file_size,
      }

      delete res.data

      if (type && type === 'json') {
        res.data = result
      } else {
        res.data = JSON.stringify(result)
      }

      try {
        resolve(utils.validateStatusCode(res))
      } catch (err) {
        reject(err)
      }
    },
    fail: () => {
      BaaS.request.wxRequestFail(reject)
    }
  })
}

/**
 * 上传文件。
 * @memberof BaaS
 * @param {FileParams} fileParams 文件参数
 * @param {FileMeta} metaData 文件元信息
 * @param {string} type 文件类型
 * @return {Promise<any>}
 */
const uploadFile = (fileParams, metaData, type) => {
  if (!fileParams || typeof fileParams !== 'object' || !fileParams.filePath) {
    throw new HError(605)
  }

  if(fileParams.fileName !== undefined && typeof fileParams.fileName !== 'string'){
    throw new HError(605)
  }

  if (!metaData) {
    metaData = {}
  } else if (typeof metaData !== 'object') {
    throw new HError(605)
  }

  let rs, rj, uploadCallback, isAborted, uploadTask = null

  let p = new Promise((resolve, reject) => {
    rs = resolve
    rj = reject
  })

  let onProgressUpdate = function (cb) {
    if (uploadTask) {
      uploadTask.onProgressUpdate(cb)
    } else {
      uploadCallback = cb
    }
    return this
  }

  let abort = function () {
    if (uploadTask) {
      uploadTask.abort()
    }
    isAborted = true
    return this
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
      abort: abort,
      onProgressUpdate: onProgressUpdate
    })
  }

  mix(p)

  let fileName = fileParams.fileName || utils.getFileNameFromPath(fileParams.filePath)
  getUploadFileConfig(fileName, utils.replaceQueryParams(metaData)).then(res => {
    if (isAborted) return rj(new Error('aborted'))

    let config = {
      id: res.data.id,
      fileName: fileName,
      policy: res.data.policy,
      authorization: res.data.authorization,
      uploadUrl: res.data.upload_url,
      filePath: fileParams.filePath,
      destLink: res.data.path
    }
    uploadTask = getUploadHeaders().then(header => {
      const upload = swanUpload(header, config, e => {
        if (isAborted) return rj(new Error('aborted'))
        rs(e)
      }, rj, type)

      if (uploadCallback) {
        upload.onProgressUpdate(uploadCallback)
      }

      return upload
    })
  }, rj)

  return p
}

module.exports = uploadFile
