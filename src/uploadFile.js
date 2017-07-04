const utils = require('./utils');
const BaaS = require('./baas')
const API_HOST = BaaS._config.API_HOST
const API = BaaS._config.API
const constants = require('./constants')
const Promise = require('./promise')

/**
 * @description upload file
 * @param  {Object} An Object that has required keys {filePath}
 * @return {Promise} upload result, a Promise object
 */

const uploadFile = (params) => {

  return new Promise((resolve, reject) => {

    if (!BaaS._config.CLIENT_ID) {
      reject('未初始化客户端')
    }

    let token = BaaS.getAuthToken()

    if(!token) {
      reject('未认证，请先完成用户登录')
    }

    wx.uploadFile({
      url: API_HOST + API.UPLOAD,
      filePath: params.filePath,
      name: constants.UPLOAD.UPLOAD_FILE_KEY,
      formData: params.formData,
      header: {
        'Authorization': constants.UPLOAD.HEADER_AUTH_VALUE + token,
        'X-Hydrogen-Client-Version': BaaS._config.VERSION,
        'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
        'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
        'User-Agent': constants.UPLOAD.UA,
      },
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  }, (err) => {
    throw new Error(err)
  })
}

module.exports = uploadFile
