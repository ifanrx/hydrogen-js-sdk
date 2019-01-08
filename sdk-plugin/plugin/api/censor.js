const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const constants = require('./constants')
const HError = require('./HError')
const utils = require('./utils')

const wxCensorImage = filePath => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: BaaS._config.API_HOST + BaaS._config.API.CENSOR_IMAGE,
      filePath: filePath,
      name: constants.UPLOAD.UPLOAD_FILE_KEY,
      header: {
        'Authorization': constants.UPLOAD.HEADER_AUTH_VALUE + BaaS.getAuthToken(),
        'X-Hydrogen-Client-Version': BaaS._config.VERSION,
        'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
        'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
        'User-Agent': constants.UPLOAD.UA,
      },
      success: res => {
        let {statusCode, data} = res

        if (parseInt(statusCode) !== constants.STATUS_CODE.SUCCESS) {
          return reject(res)
        }
        resolve(JSON.parse(data))
      },
      fail: () => {
        utils.wxRequestFail(reject)
      }
    })
  })
}

const wxCensorText = text => {
  if (!text || typeof text !== 'string') {
    return Promise.reject(new HError(605))
  }
  return baasRequest({
    url: BaaS._config.API_HOST + BaaS._config.API.CENSOR_MSG,
    method: 'POST',
    data: {
      content: text
    }
  }).then(res => res.data)
}

module.exports = BaaS => {
  BaaS.wxCensorImage = wxCensorImage
  BaaS.wxCensorText = wxCensorText
}