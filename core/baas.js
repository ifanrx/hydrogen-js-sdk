/**
 * 知晓云 JS SDK 命名空间
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
 * 应用模块
 *
 * @param {BaaS.Module} fn
 * @memberof BaaS
 * @private
 */
BaaS.use = fn => fn(BaaS)


module.exports = BaaS
