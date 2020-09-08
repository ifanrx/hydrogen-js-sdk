const BaaS = require('core-module/baas')
const constants = require('core-module/constants')
const HError = require('core-module/HError')
const utils = require('core-module/utils')
const contentType = require('core-module/utils/contentTypeMap')
const {getUploadFileConfig, getUploadHeaders} = require('core-module/upload')

const wxUpload = (config, resolve, reject, type) => {

  let uploadSuccess = (res) => {
    let result = {}
    let data = res.data || {}

    if (res.data) {
      data = JSON.parse(res.data)
    }

    result.status = 'ok'
    result.path = config.destLink
    result.file = {
      'id': config.id,
      'path': config.destLink,
      'name': config.fileName,
      'created_at': data.time || config.created_at,
      'mime_type': data.mimetyp,
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
  }

  return getUploadHeaders().then(header => {
    let extension = config.filePath.substring(config.filePath.lastIndexOf('.') + 1)
    if (config.filebucketBackend === constants.FILEBUCKET_BACKEND) {
      return wx.getFileSystemManager().readFile({
        filePath: config.filePath,
        success: (data) => {
          wx.request({
            url: config.uploadUrl,
            method: 'PUT',
            header: {
              'content-type': contentType[extension],
            },
            data: data.data,
            success: uploadSuccess,
            fail: () => {
              BaaS.request.wxRequestFail(reject)
            }
          })
        }
      })
    }
    return wx.uploadFile({
      url: config.uploadUrl,
      filePath: config.filePath,
      name: constants.UPLOAD.UPLOAD_FILE_KEY,
      formData: {
        authorization: config.authorization,
        policy: config.policy
      },
      header,
      success: uploadSuccess,
      fail: () => {
        BaaS.request.wxRequestFail(reject)
      }
    })
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

  let fileName = utils.getFileNameFromPath(fileParams.filePath)
  getUploadFileConfig(fileName, utils.replaceQueryParams(metaData)).then(res => {
    if (isAborted) return rj(new Error('aborted'))

    let config = {
      id: res.data.id,
      fileName: fileName,
      policy: res.data.policy,
      authorization: res.data.authorization,
      uploadUrl: res.data.upload_url,
      filePath: fileParams.filePath,
      destLink: res.data.path,
      filebucketBackend: res.data.filebucket_backend,
    }
    uploadTask = wxUpload(config, e => {
      if (isAborted) return rj(new Error('aborted'))
      rs(e)
    }, rj, type)
    if (uploadCallback) {
      uploadTask.onProgressUpdate(uploadCallback)
    }
  }, rj)

  return p
}

module.exports = uploadFile
