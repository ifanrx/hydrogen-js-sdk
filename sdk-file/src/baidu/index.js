const BaaS = require('core-module/baas')
const core = require('core-module/index')
const polyfill = require('./polyfill')
const auth = require('./auth')
const pay = require('./pay')
const reportTicket = require('./reportTicket')
const reportTemplateMsgAnalytics = require('./reportTemplateMsgAnalytics')

BaaS._config.VERSION = __VERSION_BAIDU__

BaaS.use(core)
BaaS.use(polyfill)
BaaS.use(auth)
BaaS.use(pay)
BaaS.use(reportTicket)
BaaS.use(reportTemplateMsgAnalytics)
BaaS.request = require('./request')
BaaS._baasRequest = require('./baasRequest')
BaaS.uploadFile = require('./uploadFile')
BaaS._createRequestMethod()
// 暴露 BaaS 到小程序环境
if (typeof swan !== 'undefined') {
  swan.BaaS = BaaS
}

module.exports = BaaS
