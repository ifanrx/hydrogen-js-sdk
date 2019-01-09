const core = require('core-module/core')
const BaaS = require('core-module/baas')
const uploadFile = require('./uploadFile')
const request = require('./request')
const auth = require('./auth')
const polyfill = require('./polyfill')
BaaS.use(core)
BaaS.use(polyfill)
BaaS.use(uploadFile)
BaaS.use(request)
BaaS.use(auth)

BaaS._createRequestMethod()

module.exports = BaaS