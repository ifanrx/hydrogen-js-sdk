const core = require('core-module/index')
const BaaS = require('core-module/baas')
try {
  BaaS._config.VERSION = __VERSION_WEB__
} catch (e) {
  // pass
}
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