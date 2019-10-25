const BaaS = require('./baas')
const storageKeyPrefix = 'ifx_baas_'

/**
 * 本地存储
 * @namespace storage
 * @memberof BaaS
 */

module.exports = {
  /**
   * 存入数据
   * @memberof BaaS.storage
   * @param {string} key 键
   * @param {any} value 值
   */
  set: (key, value) => {
    BaaS._polyfill.setStorageSync(storageKeyPrefix + key, value)
  },
  /**
   * 读取数据
   * @memberof BaaS.storage
   * @param {string} key 键
   * @return {any}
   */
  get: (key) => {
    return BaaS._polyfill.getStorageSync(storageKeyPrefix + key)
  }
}
