const BaaS = require('../baas')
const HError = require('../HError')
const utils = require('../utils')

const wxRequestFail = function (reject) {
  wx.getNetworkType({
    success: function (res) {
      if (res.networkType === 'none') {
        reject(new HError(600)) // 断网
      } else {
        reject(new HError(601)) // 网络超时
      }
    }
  })
}


const request = ({url, method = 'GET', data = {}, header = {}, dataType = 'json'}) => {
  return new Promise((resolve, reject) => {

    if (!BaaS._config.CLIENT_ID) {
      return reject(new HError(602))
    }

    let headers = utils.mergeRequestHeader(header)

    if (!/https?:\/\//.test(url)) {
      url = BaaS._config.API_HOST + url
    }

    wx.request({
      method: method,
      url: url,
      data: data,
      header: headers,
      dataType: dataType,
      success: resolve,
      fail: () => {
        wxRequestFail(reject)
      }
    })

    utils.log('Request => ' + url)
  })
}

module.exports = request
module.exports.wxRequestFail = wxRequestFail
