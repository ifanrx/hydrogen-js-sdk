const core = require('core-module/index')
const BaaS = require('core-module/baas')
const auth = require('./auth')
const request = require('./request')
const baasRequest = require('./baasRequest')
const polyfill = require('./polyfill')
const uploadFile = require('./uploadFile')
const pay = require('./pay')
const alipayQRCode = require('./alipayQRCode')
const reportTicket = require('./reportTicket')
const reportTemplateMsgAnalytics = require('./reportTemplateMsgAnalytics')

BaaS._config.VERSION = __VERSION_ALIPAY__

BaaS.use(core)
BaaS.use(auth)
BaaS.use(request)
BaaS.use(baasRequest)
BaaS.use(polyfill)
BaaS.use(uploadFile)
BaaS.use(pay)
BaaS.use(alipayQRCode)
BaaS.use(reportTicket)
BaaS.use(reportTemplateMsgAnalytics)
BaaS._createRequestMethod()

// 暴露 BaaS 到小程序环境
my.BaaS = BaaS

module.exports = BaaS
