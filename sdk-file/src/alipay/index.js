const core = require('core-module/core')
const BaaS = require('core-module/baas')
const auth = require('./auth')
const request = require('./request')
const storage = require('./storage')

BaaS.use(core)
BaaS.use(auth)
BaaS.use(request)
BaaS.use(storage)

// 暴露 BaaS 到小程序环境
my.BaaS = BaaS

module.exports = BaaS
