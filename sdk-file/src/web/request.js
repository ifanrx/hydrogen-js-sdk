const HError = require('core-module/HError')
const utils = require('core-module/utils')
const axios = require('axios')

axios.interceptors.response.use(function (response) {
  response.statusCode = response.status
  return response;
}, function (error) {
  return error.response
})

module.exports = function (BaaS) {
  BaaS.request = ({url, method = 'GET', data = {}, header = {}, headers = {}}) => {
    return new Promise((resolve, reject) => {
      if (!BaaS._config.CLIENT_ID) {
        return reject(new HError(602))
      }

      let headers = utils.mergeRequestHeader(Object.assign({}, header, headers))

      if (!/https?:\/\//.test(url)) {
        url = BaaS._config.API_HOST + url
      }

      let payload = {
        method,
        url,
        headers,
        data,
      }
      axios(payload).then(resolve, reject)
      utils.log('Request => ' + url)
    })
  }
}