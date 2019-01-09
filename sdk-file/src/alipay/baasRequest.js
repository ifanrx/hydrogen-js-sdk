const HError = require('core-module/HError')

// eslint-disable-next-line no-unused-vars
const createBaasRequestFn = BaaS => ({url, method = 'GET', data = {}, header, headers, dataType = 'json'}) => {
  return BaaS.auth.silentLogin().then(() => {
    return BaaS.request.apply(null, arguments)
  }).then(res => {
    let status = parseInt(res.status)
    if (status >= 200 && status < 300) {
      return res
    } else {
      throw new HError(res.status, BaaS.request.extractErrorMsg(res))
    }
  })
}

module.exports = function (BaaS) {
  BaaS._baasRequest = createBaasRequestFn(BaaS)
}
