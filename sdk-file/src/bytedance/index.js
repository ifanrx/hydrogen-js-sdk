const BaaS = require('core-module/baas')
const core = require('core-module/index')
const polyfill = require('./polyfill')
const auth = require('./auth')
const pay = require('./pay')
const reportTicket = require('./reportTicket')
const reportTemplateMsgAnalytics = require('./reportTemplateMsgAnalytics')
const bytedanceQRCode = require('./bytedanceQRCode')

BaaS._config.VERSION = __VERSION__

BaaS.use(core)
BaaS.use(polyfill)
BaaS.use(auth)
BaaS.use(pay)
BaaS.use(reportTicket)
BaaS.use(reportTemplateMsgAnalytics)
BaaS.use(bytedanceQRCode)
BaaS.request = require('./request')
BaaS._baasRequest = require('./baasRequest')
BaaS.uploadFile = require('./uploadFile')
BaaS.multipartUploadFile = require('./multipartUploadFile')
BaaS._createRequestMethod()

if (typeof tt !== 'undefined') {
  tt.BaaS = BaaS
}

module.exports = BaaS
