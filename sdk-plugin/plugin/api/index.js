const BaaS = require('./baas')
const core = require('./core')
const wechatAuth = require('./wechat-auth')
BaaS.use(core)
BaaS.use(wechatAuth)
BaaS.pay = require('./pay')
BaaS.request = require('./request')
BaaS._baasRequest = require('./baasRequest')
BaaS.uploadFile = require('./uploadFile')
BaaS.getWXACode = require('./getWXACode')
BaaS.wxDecryptData = require('./wxDecryptData')
BaaS.wxReportTicket = require('./templateMessage').wxReportTicket

require('./censor')(BaaS)
BaaS._createRequestMethod()
// 暴露 BaaS 到小程序环境
if (typeof wx !== 'undefined') {
  wx.BaaS = BaaS
}

module.exports = BaaS
