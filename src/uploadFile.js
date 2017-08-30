const utils = require('./utils')
const baasRequest = require('./baasRequest').baasRequest
const BaaS = require('./baas')
const API_HOST = BaaS._config.API_HOST
const API = BaaS._config.API
const constants = require('./constants')
const Promise = require('./promise')

const isAuth = (resolve, reject) => {
  if (!BaaS._config.CLIENT_ID) {
    reject('未初始化客户端')
  }

  if (!BaaS.getAuthToken()) {
    reject('未认证，请先完成用户登录')
  }
}


// get the upload config for upyun from sso
const getUploadFileConfig = (fileName) => {
  return baasRequest({
    url: API_HOST + API.UPLOAD,
    method: 'POST',
    data: {filename: fileName}
  }).then((res) => {
    return new Promise((resolve, reject) => {
      return resolve(res)
    }, (err) => {
      return reject(err)
    })
  }, (err) => {
    throw new Error(err)
  })
}

const wxUpload = (config, resolve, reject) => {
  return wx.uploadFile({
    url: config.uploadUrl,
    filePath: config.filePath,
    name: constants.UPLOAD.UPLOAD_FILE_KEY,
    formData: {
      authorization: config.authorization,
      policy: config.policy
    },
    header: {
      'Authorization': constants.UPLOAD.HEADER_AUTH_VALUE + BaaS.getAuthToken(),
      'X-Hydrogen-Client-Version': BaaS._config.VERSION,
      'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
      'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
      'User-Agent': constants.UPLOAD.UA,
    },
    success: (res) => {
      let result = {}
      result.status = 'ok'
      result.path = config.destLink

      delete res.data
      res.data = JSON.stringify(result)

      resolve(res)
    },
    fail: (err) => {
      reject(err)
    }
  })
}

const uploadFile = (params) => {

  return new Promise((resolve, reject) => {
    isAuth(resolve, reject)

    var fileName = utils.getFileNameFromPath(params.filePath)

    return getUploadFileConfig(fileName).then((res) => {
      let config = {
        policy: res.data.policy,
        authorization: res.data.authorization,
        uploadUrl: res.data.upload_url,
        filePath: params.filePath,
        destLink: res.data.file_link
      }
      return wxUpload(config, resolve, reject)
    })
  }, (err) => {
    throw new Error(err)
  })
}

module.exports = uploadFile
