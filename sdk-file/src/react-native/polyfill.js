const AsyncStorage = require('@react-native-community/async-storage').default
const constants = require('core-module/constants')
const HError = require('core-module/HError')
const utils = require('core-module/utils')

module.exports = function (BaaS) {
  Object.assign(BaaS._polyfill, {
    getSystemInfoSync: function () {
      return {
        platform: 'REACT-NATIVE',
      }
    },
    setStorageAsync: function (k, v) {
      return AsyncStorage.setItem(k, JSON.stringify({value: v}))
    },
    getStorageAsync: function (k) {
      return AsyncStorage.getItem(k).then(data => {
        if (!data) return undefined
        return JSON.parse(data).value
      })
    },
    setStorageSync: function () {
      throw new HError(611)
    },
    getStorageSync: function () {
      throw new HError(611)
    },
    CLIENT_PLATFORM: 'REACT-NATIVE',
    handleLoginSuccess(res, isAnonymous) {
      // 登录成功的 hook （login、register）调用成功后触发
      const jobs = [
        BaaS.storageAsync.set(constants.STORAGE_KEY.UID, res.data.user_id),
        BaaS.storageAsync.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token),
        BaaS.storageAsync.set(constants.STORAGE_KEY.EXPIRES_AT, utils.getExpiredAt(res.data.expires_in)),
        BaaS.storageAsync.set(constants.STORAGE_KEY.USERINFO, res.user_info),
      ]
      if (isAnonymous) {
        jobs.push(BaaS.storageAsync.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 1))
      } else {
        jobs.push(BaaS.storageAsync.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 0))
      }
      return Promise.all(jobs)
    },
    linkThirdPartyWithAuthData(...args) {
      return BaaS.auth.linkThirdPartyWithAuthData(...args)
    },
  })
}
