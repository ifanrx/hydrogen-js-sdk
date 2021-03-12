const HError = require('core-module/HError')
const constants = require('core-module/constants')
const utils = require('core-module/utils')
const createAuthFn = require('./createAuthFn')
const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const WebSocket = require('./websocket')

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

    setStorageAsync(k, v) {
      return new Promise((resolve, reject) => {
        my.setStorage({
          key: k,
          data: v,
          success: resolve,
          fail: reject,
        })
      })
    },
    getStorageAsync(k) {
      return new Promise(resolve => {
        my.getStorage({
          key: k,
          success: res => resolve(res.data),
          fail: () => resolve(undefined),
        })
      })
    },

    linkAlipay: utils.rateLimit(function (opts) {
      const forceLogin = !!opts && !!opts.forceLogin
      const userId = BaaS.storage.get(constants.STORAGE_KEY.UID)
      if (!userId) {
        throw new HError(604)
      }
      return createAuthFn(BaaS)(Object.assign({}, opts, {forceLogin}), userId)
    }),

    checkLatestVersion() {
      // 支付宝小程序不能直接判断是否在开发者工具中，
      // 只能判断当前小程序当前运行的版本，
      // 在开发者工具中，取得的值为 develop
      my.getRunScene({
        success(result) {
          if (result.envVersion === 'develop') {
            BaaS.checkVersion({platform: constants.PLATFORM.ALIPAY})
          }
        },
      })
    },
    CLIENT_PLATFORM: 'ALIPAY',
    handleLoginSuccess(res, isAnonymous) {
      // 登录成功的 hook （login、loginWithAlipay、register）调用成功后触发
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.ALIPAY_USER_ID, res.data.alipay_user_id || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, utils.getExpiredAt(res.data.expires_in))
      if (isAnonymous) {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 1)
      } else {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 0)
        tplMsgStatsReport.reportStats()
      }
    },
    WebSocket: WebSocket,
  })
}
