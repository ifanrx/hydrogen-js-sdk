const BaaS = require('./baas')
const core = require('./core')

BaaS.use(core)
BaaS.auth = require('./auth')
BaaS.pay = require('./pay')
BaaS.request = require('./request')
BaaS._baasRequest = require('./baasRequest')
BaaS.uploadFile = require('./uploadFile')
BaaS.getWXACode = require('./getWXACode')
BaaS.handleUserInfo = require('./auth').handleUserInfo
BaaS.wxDecryptData = require('./wxDecryptData')
BaaS.wxReportTicket = require('./templateMessage').wxReportTicket
BaaS.login = require('./auth').login
BaaS.logout = require('./auth').logout
require('./censor')(BaaS)
BaaS._createRequestMethod()
// 暴露 BaaS 到小程序环境
if (typeof wx !== 'undefined') {
  wx.BaaS = BaaS
}

module.exports = BaaS
