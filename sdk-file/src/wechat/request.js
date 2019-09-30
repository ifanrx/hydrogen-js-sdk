const BaaS = require('core-module/baas')
const HError = require('core-module/HError')
const utils = require('core-module/utils')
const constants = require('core-module/constants')

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

/**
 * @typedef RequestParams
 * @property {string} url 请求的 URL
 * @property {string} [method] HTTP 请求方法，默认为 'GET'
 * @property {object} [data] 请求的参数
 * @property {object} [header] 请求的 header
 * @property {string} [dataType] 返回的数据格式
 */

/**
 * 网络请求
 * @function
 * @memberof BaaS
 * @param {RequestParams} params 参数
 * @return {Promise<any>}
 */
const request = ({url, method = 'GET', data = {}, header = {}, dataType = 'json'}) => {
  return new Promise((resolve, reject) => {

    if (!BaaS._config.CLIENT_ID) {
      return reject(new HError(602))
    }

    let headers = utils.mergeRequestHeader(header)

    if (!/https?:\/\//.test(url)) {
      const API_HOST = BaaS._config.DEBUG ? BaaS._config.API_HOST : BaaS._polyfill.getAPIHost()
      url = API_HOST.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
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

    utils.log(constants.LOG_LEVEL.INFO, 'Request => ' + url)
  })
}

module.exports = request
module.exports.wxRequestFail = wxRequestFail
