const polyfill = require('../../core/polyfill')
polyfill.SDK_TYPE = 'file'
polyfill.getAPIHost = function (clientID) {
  return `https://${clientID}.xiaoapp.io`
}

polyfill.wxGetUserInfo = function (...args) {
  return wx.getUserInfo(...args)
}

polyfill.wxLogin = function (args) {
  return wx.login(...args)
}

polyfill.wxPaymentRequest = function (...args) {
  return wx.requestPayment(...args)
}
const baas = require('../../core/index')
console.log(baas)
module.exports = baas