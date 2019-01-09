const core = require('core-module/core')
const BaaS = require('core-module/baas')
const auth = require('./auth')
const request = require('./request')
const baasRequest = require('./baasRequest')
const polyfill = require('./polyfill')
const uploadFile = require('./uploadFile')

BaaS.use(core)
BaaS.use(auth)
BaaS.use(request)
BaaS.use(baasRequest)
BaaS.use(polyfill)
BaaS.use(uploadFile)
BaaS._createRequestMethod()

// 暴露 BaaS 到小程序环境
my.BaaS = BaaS

module.exports = BaaS
