const BaaS = require('./baas')
const storageKeyPrefix = 'ifx_baas_'

/**
 * 本地存储
 * @namespace storageAsync
 * @memberof BaaS
 */

module.exports = {
  /**
   * 存入数据
   * @memberof BaaS.storageAsync
   * @param {string} key 键
   * @param {Promise<any>} value 值
   */
  set: (key, value) => {
    return BaaS._polyfill.setStorageAsync(storageKeyPrefix + key, value)
  },
  /**
   * 读取数据
   * @memberof BaaS.storageAsync
   * @param {string} key 键
   * @return {Promise<any>}
   */
  get: key => {
    return BaaS._polyfill.getStorageAsync(storageKeyPrefix + key)
  },
}
