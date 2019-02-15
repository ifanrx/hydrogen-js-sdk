/**
 * 挂在 BaaS 对象的方法和属性都会被暴露到客户端环境，所以要注意保持 BaaS 对象的干净、安全
 */

const BaaS = global.BaaS || {}

BaaS._config = require('./config')
BaaS._polyfill = require('./polyfill')

BaaS.use = fn => fn(BaaS)

module.exports = BaaS
