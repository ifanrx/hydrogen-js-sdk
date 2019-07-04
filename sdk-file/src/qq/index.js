const BaaS = require('core-module/baas')
const core = require('core-module/index')
const polyfill = require('./polyfill')
const auth = require('./auth')
const reportTicket = require('./reportTicket')
const reportTemplateMsgAnalytics = require('./reportTemplateMsgAnalytics')

BaaS._config.VERSION = __VERSION_QQ__

BaaS.use(core)
BaaS.use(polyfill)
BaaS.use(auth)
BaaS.use(reportTicket)
BaaS.use(reportTemplateMsgAnalytics)
BaaS.request = require('./request')
BaaS._baasRequest = require('./baasRequest')
BaaS.uploadFile = require('./uploadFile')
BaaS._createRequestMethod()
// 暴露 BaaS 到小程序环境
if (typeof qq !== 'undefined') {
  qq.BaaS = BaaS
}

module.exports = BaaS
