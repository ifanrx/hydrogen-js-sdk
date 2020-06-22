const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const constants = require('core-module/constants')
const utils = require('core-module/utils')

module.exports = BaaS => {
  Object.assign(BaaS._polyfill, {
    wxLogin(...args) {
      return wx.login(...args)
    },
    wxGetUserInfo(...args) {
      return wx.getUserInfo(...args)
    },
    wxPaymentRequest(...args) {
      return wx.requestPayment(...args)
    },
    CLIENT_PLATFORM: 'WECHAT',
    setStorageSync(k, v) {
      return utils.withRetry(wx.setStorageSync)(k, v)
    },
    getStorageSync(k) {
      return utils.withRetry(wx.getStorageSync)(k)
    },
    setStorageAsync(k, v) {
      return new Promise((resolve, reject) => {
        wx.setStorage({
          key: k,
          data: v,
          success: resolve,
          fail: reject,
        })
      })
    },
    getStorageAsync(k) {
      return new Promise((resolve) => {
        wx.getStorage({
          key: k,
          success: res => resolve(res.data),
          fail: () => resolve(undefined),
        })
      })
    },
    getSystemInfoSync() {
      return wx.getSystemInfoSync()
    },
    linkWechat(...args) {
      return BaaS.auth.linkWechat(...args)
    },
    checkLatestVersion() {
      let info = wx.getSystemInfoSync()
      if (info.platform === 'devtools') {
        BaaS.checkVersion({platform: constants.PLATFORM.WECHAT})
      }
    },
    handleLoginSuccess(res, isAnonymous, userInfo) {
      // 登录成功的 hook （login、loginWithWechat、register）调用成功后触发
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      BaaS.storage.set(constants.STORAGE_KEY.UNIONID, res.data.unionid || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      if (res.data.openid) {
        BaaS.storage.set(
          constants.STORAGE_KEY.USERINFO,
          Object.assign({}, BaaS.storage.get(constants.STORAGE_KEY.USERINFO), userInfo || {
            id: res.data.user_id,
            openid: res.data.openid,
            unionid: res.data.unionid,
          })
        )
      }
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, utils.getExpiredAt(res.data.expires_in))
      if (isAnonymous) {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 1)
      } else {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 0)
        tplMsgStatsReport.reportStats()
      }
    },
  })
}
