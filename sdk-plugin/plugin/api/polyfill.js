module.exports = {
  wxLogin(...args) {
    return wx.login(...args)
  },
  wxGetUserInfo(...args) {
    return wx.getUserInfo(...args)
  },
  wxPaymentRequest(...args) {
    return wx.requestPayment(...args)
  },
  getAPIHost() {
    return `https://${require('./baas')._config.CLIENT_ID}.myminapp.com`
  },
  SDK_TYPE: 'file',
  CLIENT_PLATFORM: 'WECHAT',
  setStorageSync(k, v) {
    return wx.setStorageSync(k, v)
  },
  getStorageSync(k) {
    return wx.getStorageSync(k)
  },
  getSystemInfoSync() {
    return wx.getSystemInfoSync()
  }
}
