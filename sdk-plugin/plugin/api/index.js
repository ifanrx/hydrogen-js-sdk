const BaaS = require('./baas')
const core = require('./core')
const wechatAuth = require('./wechat-auth')
const censor = require('./censor')
BaaS.use(core)
BaaS.use(wechatAuth)
BaaS.use(censor)
BaaS.pay = require('./pay')
BaaS.request = require('./request')
BaaS._baasRequest = require('./baasRequest')
BaaS.uploadFile = require('./uploadFile')
BaaS.getWXACode = require('./getWXACode')
BaaS.wxDecryptData = require('./wxDecryptData')
BaaS.wxReportTicket = require('./templateMessage').wxReportTicket
BaaS._polyfill.linkWechat = function () {
  return new Promise((resolve, reject) => {
    // TODO:: 绑定微信账号
    resolve(true)
  })
}

BaaS._createRequestMethod()
// 暴露 BaaS 到小程序环境
if (typeof wx !== 'undefined') {
  wx.BaaS = BaaS
}

module.exports = BaaS
