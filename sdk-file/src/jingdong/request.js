const BaaS = require('core-module/baas')
const HError = require('core-module/HError')
const utils = require('core-module/utils')
const constants = require('core-module/constants')

const jdRequestFail = function (reject) {
  jd.getNetworkType({
    success: function (res) {
      if (res.networkType === 'none') {
        reject(new HError(600)) // 断网
      } else {
        reject(new HError(601)) // 网络超时
      }
    },
  })
}

/**
 * 网络请求
 * @function
 * @memberof BaaS
 * @param {BaaS.RequestParams} params 参数
 * @return {Promise<BaaS.Response<any>>}
 */
const request = ({url, method = 'GET', data = {}, header = {}, dataType = 'json'}) => {
  return utils.mergeRequestHeader(header).then(headers => {
    return new Promise((resolve, reject) => {

      if (!BaaS._config.CLIENT_ID) {
        return reject(new HError(602))
      }

      if (!/https?:\/\//.test(url)) {
        const API_HOST = BaaS._polyfill.getAPIHost()
        url = API_HOST.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
      }

      // 兼容 PUT 与 DELETE 请求，京东暂时只支持 GET 与 POST 两种请求
      if (method.toUpperCase() === 'PUT' || method.toUpperCase() === 'DELETE') {
        headers['X-Hydrogen-Request-Method'] = method
        method = 'POST'
      }
      jd.request({
        method: method,
        url: url,
        data: data,
        header: headers,
        dataType: dataType,
        success: resolve,
        fail: (e) => {
          if (e && e.statusCode) {
            const herror = new HError(e.statusCode, e.errMsg)
            reject(herror)
            return
          }
          jdRequestFail(reject)
        },
      })

      utils.log(constants.LOG_LEVEL.INFO, 'Request => ' + url)
    })
  })
}

module.exports = request
module.exports.jdRequestFail = jdRequestFail
