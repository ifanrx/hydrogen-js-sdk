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
