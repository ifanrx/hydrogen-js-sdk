const storage = require('core-module/storage')
const utils = require('core-module/utils')
const constants = require('core-module/constants')
let sessionInitPromise = null

module.exports = function (BaaS) {
  const sessionInit = () => {
    if (!sessionInitPromise) {
      sessionInitPromise = BaaS.request({
        url: API.LOGIN,
        method: 'POST',
        data: {
          code: 'test'
        }
      }).then(res => {
        sessionInitPromise = null
        storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
        storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
        return res
      })
    }
    return sessionInitPromise
  }


  const silentLogin = () => {
    // 如果有 token，且 token 未过期，则无需重新发起 sessionInit
    if (storage.get(constants.STORAGE_KEY.AUTH_TOKEN) && !utils.isSessionExpired()) {
      return Promise.resolve()
    }
    return sessionInit()
  }

  BaaS.auth.silentLogin = silentLogin
}