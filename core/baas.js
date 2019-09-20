/**
 * 挂在 BaaS 对象的方法和属性都会被暴露到客户端环境，所以要注意保持 BaaS 对象的干净、安全
 *
 * @namespace BaaS
 */
const BaaS = global.BaaS || {}

/**
 * @namespace BaaS._config
 */
BaaS._config = require('./config')
BaaS._polyfill = require('./polyfill')

/**
 * 模块
 *
 * @typedef {Function} Module
 * @param {any} BaaS - BaaS 对象
 * @memberof BaaS
 */

/**
 * 应用模块
 *
 * @param {Module} fn
 * @memberof BaaS
 * @private
 */
BaaS.use = fn => fn(BaaS)


module.exports = BaaS
