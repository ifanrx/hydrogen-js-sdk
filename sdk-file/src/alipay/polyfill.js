const HError = require('core-module/HError')
const constants = require('core-module/constants')
const createAuthFn = require('./createAuthFn')

module.exports = function (BaaS) {
  Object.assign(BaaS._polyfill, {
    getSystemInfoSync: function () {
      return my.getSystemInfoSync()
    },

    setStorageSync: function (key, value) {
      return my.setStorageSync({
        key,
        data: value,
      })
    },

    getStorageSync: function (key) {
      return my.getStorageSync({ key }).data
    },

    linkAlipay: function ({forceLogin = false}) {
      const userId = BaaS.storage.get(constants.STORAGE_KEY.UID)
      if (!userId) {
        throw new HError(604)
      }
      return createAuthFn(BaaS)(forceLogin, userId)
    },
  })
}
