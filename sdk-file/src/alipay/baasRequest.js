const HError = require('core-module/HError')
const constants = require('core-module/constants')

// eslint-disable-next-line no-unused-vars
const createBaasRequestFn = BaaS => ({url, method = 'GET', data = {}, header, headers, dataType = 'json'}) => {
  return BaaS.auth.silentLogin().then(() => {
    return BaaS.request.apply(null, arguments)
  }).then(res => {
    let status = parseInt(res.status)
    if (status >= 200 && status < 300) {
      return res
    } else if (res.statusCode == constants.STATUS_CODE.UNAUTHORIZED && url.match(config.API_HOST_PATTERN)) {
      return tryResendRequest(BaaS, {header, headers, method, url, data, dataType})
    } else {
      throw new HError(res.status, BaaS.request.extractErrorMsg(res))
    }
  })
}

/**
 * @param {object} payload
 */
function tryResendRequest(BaaS, payload) {
  const baasRequest = createBaasRequestFn(BaaS)

  // 情景1：若是第一次出现 401 错误，此时的缓存一定是过期的。
  // 情景2：假设有 a,b 两个 401 错误的请求，a请求 300ms 后返回，走情景 1 的逻辑。b 在 pending 10 秒后返回，此时缓存实际上是没过期的，但是仍然会重新清空缓存，走情景 1 逻辑。
  // 情景3：假设有 a,b,c 3 个并发请求，a 先返回，走了情景 1 的逻辑，此时 bc 请求在 silentLogin 请求返回前返回了，这时候他们会等待 silentLogin , 即多个请求只会发送一次 silentLogin 请求
  if (BaaS.storage.get(constants.STORAGE_KEY.UID)) {
    // 缓存被清空，silentLogin 一定会发起 session init 请求
    BaaS.clearSession()
  }
  return baasRequest(payload)
}

module.exports = function (BaaS) {
  BaaS._baasRequest = createBaasRequestFn(BaaS)
}
