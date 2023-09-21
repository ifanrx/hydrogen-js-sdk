const BaaS = require('core-module/baas')
const core = require('core-module/index')
const polyfill = require('./polyfill')
const auth = require('./auth')

BaaS._config.VERSION = __VERSION__

BaaS.use(core)
BaaS.use(polyfill)
BaaS.use(auth)
BaaS.request = require('./request')
BaaS._baasRequest = require('./baasRequest')
BaaS.uploadFile = require('./uploadFile')
BaaS.multipartUploadFile = require('./multipartUploadFile')
BaaS._createRequestMethod()

if (typeof jd !== 'undefined') {
  jd.BaaS = BaaS
}

module.exports = BaaS
