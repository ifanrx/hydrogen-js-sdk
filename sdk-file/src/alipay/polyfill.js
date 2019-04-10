const HError = require('core-module/HError')
const constants = require('core-module/constants')
const utils = require('core-module/utils')
const createAuthFn = require('./createAuthFn')
const tplMsgStatsReport = require('core-module/tplMsgStatsReport')

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
      return my.getStorageSync({key}).data
    },

    linkAlipay: utils.rateLimit(function (opts) {
      const forceLogin = !!opts && !!opts.forceLogin
      const userId = BaaS.storage.get(constants.STORAGE_KEY.UID)
      if (!userId) {
        throw new HError(604)
      }
      return createAuthFn(BaaS)({forceLogin}, userId)
    }),

    checkLatestVersion() {
      // 支付宝小程序不能直接判断是否在开发者工具中，
      // 只能判断当前小程序当前运行的版本，
      // 在开发者工具中，取得的值为 develop
      my.getRunScene({
        success(result) {
          if (result.envVersion === 'develop') {
            BaaS.checkVersion({platform: 'alipay_miniapp'})
          }
        }
      })
    },
    CLIENT_PLATFORM: 'ALIPAY',
    handleLoginSuccess(res, isAnonymous) {
      // 登录成功的 hook （login、loginWithAlipay、register）调用成功后触发
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.ALIPAY_USER_ID, res.data.alipay_user_id || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
      if (isAnonymous) {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 1)
      } else {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 0)
        tplMsgStatsReport.reportStats()
      }
    },
  })
}
