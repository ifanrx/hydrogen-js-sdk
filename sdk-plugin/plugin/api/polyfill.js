module.exports = {
  wxLogin(...args) {
    return wx.login(...args)
  },
  wxGetUserInfo(...args) {
    return wx.getUserInfo(...args)
  },
  wxPaymentRequest(...args){
    return wx.requestPayment(...args)
  },
  getAPIHost(clientID) {
    return `https://${clientID}.xiaoapp.io`
  },
  SDK_TYPE: 'file',

}