require('core-js/features/promise')
require('core-js/es/number/is-integer')
require('core-js/es/string/starts-with')
require('core-js/web/url')
const core = require('core-module/index')
const BaaS = require('core-module/baas')
const storage = require('./storage')

BaaS._config.VERSION = __VERSION__

const uploadFile = require('../web/uploadFile')
const request = require('../web/request')
const baasRequest = require('../web/baasRequest')
const polyfill = require('./polyfill')
BaaS.use(core)
BaaS.use(polyfill)
BaaS.use(uploadFile)
BaaS.use(request)
BaaS.use(baasRequest)

BaaS._createRequestMethod()

const rawInit = BaaS.init
BaaS.init = function(...args) {
  rawInit(...args)
  return storage.init()
}

module.exports = BaaS
