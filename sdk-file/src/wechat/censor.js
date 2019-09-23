const constants = require('core-module/constants')
const HError = require('core-module/HError')
const utils = require('core-module/utils')

module.exports = BaaS => {
  const wxCensorImage = filePath => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: BaaS._polyfill.getAPIHost() + BaaS._config.API.WECHAT.CENSOR_IMAGE,
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
          BaaS.request.wxRequestFail(reject)
        }
      })
    })
  }

  const wxCensorText = text => {
    if (!text || typeof text !== 'string') {
      return Promise.reject(new HError(605))
    }
    return BaaS._baasRequest({
      url: BaaS._config.API.WECHAT.CENSOR_MSG,
      method: 'POST',
      data: {
        content: text
      }
    })
  }

  const censorAsync = fileId => {
    return BaaS._baasRequest({
      url: BaaS._config.API.WECHAT.CENSOR_ASYNC,
      method: 'POST',
      data: {
        file_id: fileId,
      }
    })
  }

  const getCensorResult = id => {
    return BaaS._baasRequest({
      url: `${BaaS._config.API.WECHAT.CENSOR_ASYNC}${id}/`,
    })
  }

  BaaS.wxCensorImage = wxCensorImage
  BaaS.wxCensorText = wxCensorText
  BaaS.censorAsync = censorAsync
  BaaS.getCensorResult = getCensorResult
}
