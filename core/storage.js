const BaaS = require('./baas')
const storageKeyPrefix = 'ifx_baas_'

module.exports = {
  set: (key, value) => {
    BaaS._polyfill.setStorageSync(storageKeyPrefix + key, value)
  },
  get: (key) => {
    return BaaS._polyfill.getStorageSync(storageKeyPrefix + key)
  }
}
