const constants = require('core-module/constants')
const utils = require('core-module/utils')
let thirdPartyAuthRequest = require('./thirdPartyAuthRequest')

module.exports = function (BaaS) {
  Object.assign(BaaS._polyfill, {
    getSystemInfoSync: function () {
      return {
        platform: 'WEB'
      }
    },
    setStorageSync: function (k, v) {
      window.localStorage.setItem(k, JSON.stringify({value: v}))
    },
    getStorageSync: function (k) {
      try {
        return JSON.parse(window.localStorage.getItem(k)).value
      } catch (e) {
        return null
      }
    },
    CLIENT_PLATFORM: 'WEB',
    handleLoginSuccess(res, isAnonymous) {
      // 登录成功的 hook （login、register）调用成功后触发
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
      if (isAnonymous) {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 1)
      } else {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 0)
      }
    },
    linkThirdParty(provider, authPageUrl, options = {}) {
      return thirdPartyAuthRequest({...options, provider, authPageUrl, handler: constants.THIRD_PARTY_AUTH_HANDLER.ASSOCIATE})
    },
  })
}
