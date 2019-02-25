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
    }
  })
}