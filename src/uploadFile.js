const baasRequest = require('./baasRequest').baasRequest
const BaaS = require('./baas')
const API = BaaS._config.API
const constants = require('./constants')
const Promise = require('./promise')

/**
 * @description upload file
 * @param  {Object} An Object that has required keys {filePath}
 * @return {Promise} upload result, a Promise object
 */

const uploadFile = (params) => {
  return baasRequest({
    url: API.UPLOAD
  }).then((res) => {
    let token = BaaS.getAuthToken()

    if (!token) {
      let intervalID = setInterval(() => {
        token = BaaS.getAuthToken()
        if (token) {
          clearInterval(intervalID)
        }
      }, 500)
    }

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: API.UPLOAD,
        filePath: params.filePath,
        name: constants.UPLOAD.UPLOAD_FILE_KEY,
        formData: params.formData,
        header: {
          'Authorization': constants.UPLOAD.HEADER_AUTH_VALUE + token,
          'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
        },
        success: (res) => {
          return resolve(res)
        },
        fail: (err) => {
          return reject(err)
        }
      })

    }, (err) => {
      throw new Error(err)
    })
  })
}

module.exports = uploadFile
