const HError = require('core-module/HError')
const utils = require('core-module/utils')
const constants = require('core-module/constants')
const axios = require('axios')

axios.interceptors.response.use(function (response) {
  response.statusCode = response.status
  return response
}, function (error) {
  throw error.response
})

module.exports = function (BaaS) {
  /**
   * 网络请求
   * @function
   * @memberof BaaS
   * @param {BaaS.WebRequestParams} params 参数
   * @return {Promise<BaaS.Response<any>>}
   */
  BaaS.request = ({url, method = 'GET', data = {}, header = {}, headers = {}}) => {
    return new Promise((resolve, reject) => {
      if (!BaaS._config.CLIENT_ID) {
        return reject(new HError(602))
      }

      if (!/https?:\/\//.test(url)) {
        const API_HOST = BaaS._config.DEBUG ? BaaS._config.API_HOST : BaaS._polyfill.getAPIHost()
        url = API_HOST.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
      }

      let payload = {
        method,
        url,
        headers: utils.mergeRequestHeader(Object.assign({}, header, headers)),
      }

      if (method.toUpperCase() === 'GET') {
        payload.params = data
      } else {
        payload.data = data
      }

      axios(payload).then(resolve, reject)
      utils.log(constants.LOG_LEVEL.INFO, 'Request => ' + url)
    })
  }
}
