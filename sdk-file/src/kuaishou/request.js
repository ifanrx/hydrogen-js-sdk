const BaaS = require('core-module/baas')
const HError = require('core-module/HError')
const utils = require('core-module/utils')
const constants = require('core-module/constants')

const ksRequestFail = function (reject) {
  ks.getNetworkType({
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

      // 兼容 PUT 与 DELETE 请求，快手暂时只支持 GET 与 POST 两种请求
      if (method.toUpperCase() === 'PUT' || method.toUpperCase() === 'DELETE') {
        headers['X-Hydrogen-Request-Method'] = method
        method = 'POST'
      }
      ks.request({
        method: method,
        url: url,
        data: data,
        header: headers,
        dataType: dataType,
        success: resolve,
        fail: e => {
          // 由于快手没有对 request fail 的情况输出 statusCode，因此需要手动兼容一下
          if (e && e.errMsg && e.errMsg.includes(constants.STATUS_CODE.UNAUTHORIZED.toString())) {
            e.statusCode = constants.STATUS_CODE.UNAUTHORIZED
          }

          if (e && e.statusCode) {
            const herror = new HError(e.statusCode, e.errMsg)
            reject(herror)
            return
          }
          ksRequestFail(reject)
        },
      })

      utils.log(constants.LOG_LEVEL.INFO, 'Request => ' + url)
    })
  })
}

module.exports = request
module.exports.ksRequestFail = ksRequestFail
