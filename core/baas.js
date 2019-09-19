/**
 * 挂在 BaaS 对象的方法和属性都会被暴露到客户端环境，所以要注意保持 BaaS 对象的干净、安全
 *
 * @namespace BaaS
 */
const BaaS = global.BaaS || {}

/**
 * @type {Config}
 * @memberof BaaS
 */
BaaS._config = require('./config')
BaaS._polyfill = require('./polyfill')

/**
 * 插件
 *
 * @typedef {Function} Plugin
 * @param {BaaS} BaaS - BaaS 对象
 * @memberof BaaS
 */

/**
 * 应用插件
 *
 * @param {Plugin} fn
 * @memberof BaaS
 */
BaaS.use = fn => fn(BaaS)


module.exports = BaaS
