const storage = require('core-module/storage')
const utils = require('core-module/utils')
const constants = require('core-module/constants')

module.exports = function (BaaS) {
  const silentLogin = () => {
    // 如果有 token，且 token 未过期，则无需重新发起匿名登录
    if (storage.get(constants.STORAGE_KEY.AUTH_TOKEN) && !utils.isSessionExpired()) {
      return Promise.resolve()
    }
    return BaaS.auth.anonymousLogin()
  }

  BaaS.auth.silentLogin = silentLogin
}