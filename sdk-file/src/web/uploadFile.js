const axios = require('axios')
const constants = require('core-module/constants')
const HError = require('core-module/HError')
const utils = require('core-module/utils')
const {getUploadFileConfig} = require('core-module/upload')
module.exports = function (BaaS) {
  BaaS.uploadFile = function (fileParams, metaData) {
    let fileObj = fileParams.fileObj
    if (!fileObj || typeof fileObj !== 'object' || !fileObj.name) {
      throw new HError(605)
    }

    if (!metaData) {
      metaData = {}
    } else if (typeof metaData !== 'object') {
      throw new HError(605)
    }
    let config = {}
    return getUploadFileConfig(fileObj.name, utils.replaceQueryParams(metaData)).then(res => {
      config = {
        id: res.data.id,
        fileName: fileObj.name,
        policy: res.data.policy,
        authorization: res.data.authorization,
        uploadUrl: res.data.upload_url,
        filePath: fileObj.name,
        destLink: res.data.file_link
      }

      let fd = new FormData()
      fd.append(constants.UPLOAD.UPLOAD_FILE_KEY, fileObj, fileObj.name)
      fd.append('policy', config.policy)
      fd.append('authorization', config.authorization)

      return axios.post(config.uploadUrl, fd)
    }).then((res) => {
      let result = {}
      let data = res.data
      result.status = 'ok'
      result.path = config.destLink
      result.file = {
        'id': config.id,
        'name': config.fileName,
        'created_at': data.time,
        'mime_type': data.mimetype,
        'cdn_path': data.url,
        'size': data.file_size,
      }
      return result
    })
  }
}
