const utils = require('core-module/utils')
const BaaS = require('core-module/baas')
const constants = require('core-module/constants')
const storage = require('core-module/storage')

/*
 * 重发请求
 * 情景1：若是第一次出现 401 错误，此时的缓存一定是过期的。
 * 情景2：假设有 a,b 两个 401 错误的请求，a请求 300ms 后返回，走情景 1 的逻辑。b 在 pending 10 秒后返回，此时缓存实际上是没过期的，但是仍然会重新清空缓存，走情景 1 逻辑。
 * 情景3：假设有 a,b,c 3 个并发请求，a 先返回，走了情景 1 的逻辑，此时 bc 请求在 silentLogin 请求返回前返回了，这时候他们会等待 silentLogin , 即多个请求只会发送一次 silentLogin 请求
 *
 * @param {object} payload
 */
function tryResendRequest(payload) {
  let prevUid = storage.get(constants.STORAGE_KEY.UID)
  let preAction = Promise.resolve()
  if (storage.get(constants.STORAGE_KEY.AUTH_TOKEN)) {
    // 缓存被清空，silentLogin 一定会发起 session init 请求
    preAction = BaaS.clearSession()
  }

  return preAction.then(() => {
    return BaaS.auth.silentLogin()
      .then(() => utils.getResendPayload(BaaS, payload, prevUid))
      .then(resendPayload => BaaS.request(resendPayload))
      .then(utils.validateStatusCode)
  })
}

// BaaS 网络请求，此方法能保证在已登录 BaaS 后再发起请求
// eslint-disable-next-line no-unused-vars
const baasRequest = function (args) {
  let beforeRequestPromise = BaaS._config.AUTO_LOGIN ? BaaS.auth.silentLogin() : Promise.resolve()

  // 由于快手没有对 request fail 的情况输出 statusCode，因此需要手动兼容一下
  const retryOnFailed = res => {
    if (parseInt(res.code) === constants.STATUS_CODE.UNAUTHORIZED && BaaS._config.AUTO_LOGIN) {
      return tryResendRequest(args)
    } else {
      throw res
    }
  }

  return beforeRequestPromise
    .then(() => {
      return BaaS.request(args).catch(retryOnFailed)
    })
    .catch(retryOnFailed)
}

module.exports = baasRequest
