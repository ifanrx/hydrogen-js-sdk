const BaaS = require('./baas')
const core = require('./core')

// BaaS.auth = require('./baasRequest').auth
BaaS.use(core)
BaaS.uploadFile = require('./uploadFile')
BaaS.handleUserInfo = require('./auth').handleUserInfo
BaaS.wxDecryptData = require('./wxDecryptData')
BaaS.wxReportTicket = require('./templateMessage').wxReportTicket
BaaS.login = require('./auth').login
BaaS.logout = require('./auth').logout
require('./censor')(BaaS)

// 暴露 BaaS 到小程序环境
if (typeof wx !== 'undefined') {
  wx.BaaS = BaaS
}

module.exports = BaaS
