const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const constants = require('core-module/constants')
module.exports = BaaS => {
  let CLIENT_PLATFORM
  let TEMPLATE_MESSAGE_PLATFORM

  if (typeof qq == 'undefined') {
    CLIENT_PLATFORM = 'WECHAT'
    TEMPLATE_MESSAGE_PLATFORM = 'wechat_miniapp'
    BaaS._polyfill.linkWechat = function (...args) {
      return BaaS.auth.linkWechat(...args)
    }
  } else {
    wx = qq
    CLIENT_PLATFORM = 'QQ'
    TEMPLATE_MESSAGE_PLATFORM = 'qq_miniapp'
    BaaS._polyfill.linkQQ = function (...args) {
      return BaaS.auth.linkQQ(...args)
    }
  }

  Object.assign(BaaS._polyfill, {
    wxLogin(...args) {
      return wx.login(...args)
    },
    wxRequest(...args) {
      return wx.request(...args)
    },
    wxGetUserInfo(...args) {
      return wx.getUserInfo(...args)
    },
    wxPaymentRequest(...args) {
      return wx.requestPayment(...args)
    },
    CLIENT_PLATFORM,
    TEMPLATE_MESSAGE_PLATFORM,
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
    getNetworkType(...args) {
      return wx.getNetworkType(...args)
    },
    checkLatestVersion() {
      let info = wx.getSystemInfoSync()
      if (info.platform !== 'devtools') return
      if (typeof qq == 'undefined') {
        BaaS.checkVersion({platform: 'wechat_miniapp'})
      } else {
        BaaS.checkVersion({platform: 'qq_miniapp'})
      }
    },
    handleLoginSuccess(res, isAnonymous) {
      // 登录成功的 hook （login、loginWithWechat、register）调用成功后触发
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      if (typeof qq == 'undefined') {
        BaaS.storage.set(constants.STORAGE_KEY.UNIONID, res.data.unionid || '')
      }
      if (res.data.openid && typeof qq == 'undefined') {
        BaaS.storage.set(constants.STORAGE_KEY.USERINFO, {
          id: res.data.user_id,
          openid: res.data.openid,
          unionid: res.data.unionid,
        })
      } else if (res.data.openid) {
        BaaS.storage.set(constants.STORAGE_KEY.USERINFO, {
          id: res.data.user_id,
          openid: res.data.openid,
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
