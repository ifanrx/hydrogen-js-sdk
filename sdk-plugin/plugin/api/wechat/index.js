const BaaS = require('../baas')
const core = require('../index')
const wechatAuth = require('./auth')
const polyfill = require('./polyfill')
const censor = require('./censor')
BaaS.use(core)
BaaS.use(polyfill)
BaaS.use(wechatAuth)
BaaS.use(censor)
BaaS.pay = require('./pay')
BaaS.order = require('./order')
BaaS.request = require('./request')
BaaS._baasRequest = require('./baasRequest')
BaaS.uploadFile = require('./uploadFile')
BaaS.getWXACode = require('./getWXACode')
BaaS.wxDecryptData = require('./wxDecryptData')
BaaS.wxReportTicket = require('./templateMessage').wxReportTicket
BaaS.ErrorTracker = require('./errorTracker')
BaaS._createRequestMethod()
// 暴露 BaaS 到小程序环境
if (typeof wx !== 'undefined') {
  wx.BaaS = BaaS
}

module.exports = BaaS
