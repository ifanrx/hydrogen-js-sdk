const {getUploadFileConfig, getUploadHeaders} = require('core-module/upload')
const HError = require('core-module/HError')
const constants = require('core-module/constants')
const utils = require('core-module/utils')

class UploadError extends HError {
  mapErrorMessage(code) {
    switch (code) {
    case 11:
      return '文件不存在'
    case 12:
      return '上传文件失败'
    case 13:
      return '没有权限'
    default:
      return '未知错误'
    }
  }
}

const myUpload = (config, resolve, reject) => {
  return getUploadHeaders().then(header => {
    return my.uploadFile({
      url: config.uploadUrl,
      filePath: config.filePath,
      fileName: constants.UPLOAD.UPLOAD_FILE_KEY,
      fileType: config.fileType,
      formData: {
        authorization: config.authorization,
        policy: config.policy,
      },
      header,
      success: (res) => {
        let result = {}
        let data = JSON.parse(res.data)
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
        res.data = result
        resolve(res)
      },
      fail: res => {
        reject(new UploadError(parseInt(res.error), res.errorMessage))
      },
    })
  })
}

/**
 * 上传文件。
 * @function
 * @name uploadFile
 * @memberof BaaS
 * @param {FileParams} fileParams 文件参数
 * @param {FileMeta} metaData 文件元信息
 * @return {Promise<any>}
 */
const createUploadFileFn = () => (fileParams, metaData) => {
  if (!fileParams || typeof fileParams !== 'object' || !fileParams.filePath) {
    throw new HError(605)
  }

  if (!metaData) {
    metaData = {}
  } else if (typeof metaData !== 'object') {
    throw new HError(605)
  }

  let rs, rj = null

  let p = new Promise((resolve, reject) => {
    rs = resolve
    rj = reject
  })

  let fileName = utils.getFileNameFromPath(fileParams.filePath)
  getUploadFileConfig(fileName, utils.replaceQueryParams(metaData)).then(res => {
    let config = {
      id: res.data.id,
      fileName: fileName,
      policy: res.data.policy,
      authorization: res.data.authorization,
      uploadUrl: res.data.upload_url,
      filePath: fileParams.filePath,
      fileType: fileParams.fileType,
      destLink: res.data.path,
    }
    myUpload(config, e => {
      rs(e)
    }, rj)
  }, rj)

  return p
}

module.exports = function (BaaS) {
  BaaS.uploadFile = createUploadFileFn()
}
module.exports.UploadError = UploadError
