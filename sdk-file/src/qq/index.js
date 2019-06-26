const BaaS = require('core-module/baas')
const core = require('core-module/index')
const polyfill = require('../wechat/polyfill')
const auth = require('../wechat/auth')
const reportTicket = require('../wechat/wxReportTicket')

BaaS._config.VERSION = __VERSION_QQ__

BaaS.use(core)
BaaS.use(polyfill)
BaaS.use(auth)
BaaS.use(reportTicket)
BaaS.request = require('../wechat/request')
BaaS._baasRequest = require('../wechat/baasRequest')
BaaS.uploadFile = require('../wechat/uploadFile')
BaaS._createRequestMethod()

BaaS._config.API.WECHAT = {
  ...BaaS._config.API.WECHAT,
  ...BaaS._config.API.QQ,
}

BaaS.auth.loginWithQQ = BaaS.auth.loginWithWechat
BaaS.auth.linkQQ = BaaS.auth.linkWechat
delete BaaS.auth.loginWithWechat
delete BaaS.auth.linkWechat

// 暴露 BaaS 到小程序环境
if (typeof qq !== 'undefined') {
  qq.BaaS = BaaS
}

module.exports = BaaS
