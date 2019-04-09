const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const constants = require('core-module/constants')
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
      // 增加重试
      // https://developers.weixin.qq.com/community/develop/doc/a352fb32bfc76cb6a6438925e4edf9b1
      try {
        return wx.setStorageSync(k, v)
      } catch (err) {
        return wx.setStorageSync(k, v)
      }
    },
    getStorageSync(k) {
      try {
        return wx.getStorageSync(k)
      } catch (e) {
        return wx.getStorageSync(k)
      }
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
        BaaS.checkVersion({platform: 'wechat_miniapp'})
      }
    },
    handleLoginSuccess(res, isAnonymous) {
      // 登录成功的 hook （login、loginWithWechat、register）调用成功后触发
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      BaaS.storage.set(constants.STORAGE_KEY.UNIONID, res.data.unionid || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      if (res.data.openid) {
        BaaS.storage.set(constants.STORAGE_KEY.USERINFO, {
          id: res.data.user_id,
          openid: res.data.openid,
          unionid: res.data.unionid,
        })
      }
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
