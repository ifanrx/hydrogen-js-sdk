const HError = require('core-module/HError')
const utils = require('core-module/utils')
const axios = require('axios')

axios.interceptors.response.use(function (response) {
  response.statusCode = response.status
  return response
}, function (error) {
  throw error.response
})

module.exports = function (BaaS) {
  BaaS.request = ({url, method = 'GET', data = {}, header = {}, headers = {}}) => {
    return new Promise((resolve, reject) => {
      if (!BaaS._config.CLIENT_ID) {
        return reject(new HError(602))
      }

      if (!/https?:\/\//.test(url)) {
        url = BaaS._polyfill.getAPIHost() + url
      }

      let payload = {
        method,
        url,
        headers: utils.mergeRequestHeader(Object.assign({}, header, headers)),
        data,
      }

      axios(payload).then(resolve, reject)
      utils.log('Request => ' + url)
    })
  }
}
