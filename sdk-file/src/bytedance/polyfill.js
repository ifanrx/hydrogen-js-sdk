// const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const constants = require('core-module/constants')
const WebSocket = require('./websocket')

module.exports = BaaS => {
  Object.assign(BaaS._polyfill, {
    CLIENT_PLATFORM: 'BYTEDANCE',
    setStorageSync(k, v) {
      return tt.setStorageSync(k, v)
    },
    getStorageSync(k) {
      return tt.getStorageSync(k)
    },
    setStorageAsync(k, v) {
      return new Promise((resolve, reject) => {
        tt.setStorage({
          key: k,
          data: v,
          success: resolve,
          fail: reject,
        })
      })
    },
    getStorageAsync(k) {
      return new Promise((resolve) => {
        tt.getStorage({
          key: k,
          success: res => resolve(res.data),
          fail: () => resolve(undefined),
        })
      })
    },
    getSystemInfoSync() {
      return tt.getSystemInfoSync()
    },
    checkLatestVersion() {
      let info = tt.getSystemInfoSync()
      if (info.platform === 'devtools') {
        BaaS.checkVersion({platform: constants.PLATFORM.BYTEDANCE})
      }
    },
    linkTt(...args) {
      return BaaS.auth.linkTt(...args)
    },
    handleLoginSuccess(res, isAnonymous, userInfo) {
      // 登录成功的 hook （login、loginWithTt、register）调用成功后触发
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
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
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
