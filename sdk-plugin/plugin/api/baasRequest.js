const HError = require('./HError')
const utils = require('./utils')
const BaaS = require('./baas')

// BaaS 网络请求，此方法能保证在已登录 BaaS 后再发起请求
// eslint-disable-next-line no-unused-vars
const baasRequest = function ({url, method = 'GET', data = {}, header = {}, dataType = 'json'}) {
  return BaaS.auth.silentLogin().then(() => {
    return BaaS.request.apply(null, arguments)
  }).then(res => {
    let status = parseInt(res.statusCode)
    if (status >= 200 && status < 300) {
      return res
    } else {
      throw new HError(res.statusCode, utils.extractErrorMsg(res))
    }
  })
}

module.exports = baasRequest
