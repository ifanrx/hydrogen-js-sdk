require('core-js/features/promise')
require('core-js/es/number/is-integer')
require('core-js/es/string/starts-with')
require('core-js/web/url')
require('./vendors/eventListener.polyfill')
const core = require('core-module/index')
const BaaS = require('core-module/baas')

// 兼容 ie
if (window.location && !window.location.origin) {
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

BaaS._config.VERSION = __VERSION_WEB__

const uploadFile = require('./uploadFile')
const request = require('./request')
const baasRequest = require('./baasRequest')
const auth = require('./auth')
const polyfill = require('./polyfill')
BaaS.use(core)
BaaS.use(polyfill)
BaaS.use(uploadFile)
BaaS.use(request)
BaaS.use(baasRequest)
BaaS.use(auth)

BaaS._createRequestMethod()

module.exports = BaaS
