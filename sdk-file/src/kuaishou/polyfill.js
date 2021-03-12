// const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const constants = require('core-module/constants')
const utils = require('core-module/utils')
const WebSocket = require('./websocket')

module.exports = BaaS => {
  Object.assign(BaaS._polyfill, {
    CLIENT_PLATFORM: 'KUAISHOU',
    setStorageSync(k, v) {
      return ks.setStorageSync(k, v)
    },
    getStorageSync(k) {
      return ks.getStorageSync(k)
    },
    setStorageAsync(k, v) {
      return new Promise((resolve, reject) => {
        ks.setStorage({
          key: k,
          data: v,
          success: resolve,
          fail: reject,
        })
      })
    },
    getStorageAsync(k) {
      return new Promise((resolve) => {
        ks.getStorage({
          key: k,
          success: res => resolve(res.data),
          fail: () => resolve(undefined),
        })
      })
    },
    getSystemInfoSync() {
      return ks.getSystemInfoSync()
    },
    checkLatestVersion() {
      let info = ks.getSystemInfoSync()
      if (info.platform === 'devtools') {
        BaaS.checkVersion({platform: constants.PLATFORM.JONGDONG})
      }
    },
    linkKs(...args) {
      return BaaS.auth.linkKs(...args)
    },
    handleLoginSuccess(res, isAnonymous, userInfo) {
      // 登录成功的 hook （login、loginWithKs、register）调用成功后触发
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      if (res.data.openid) {
        BaaS.storage.set(
          constants.STORAGE_KEY.USERINFO,
          Object.assign({}, BaaS.storage.get(constants.STORAGE_KEY.USERINFO), userInfo || {
            id: res.data.user_id,
            openid: res.data.openid,
          })
        )
      }
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, utils.getExpiredAt(res.data.expires_in))
      if (isAnonymous) {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 1)
      } else {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 0)
        // tplMsgStatsReport.reportStats()
      }
    },
    WebSocket: WebSocket,
  })
}
