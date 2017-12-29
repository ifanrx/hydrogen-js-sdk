const storageKeyPrefix = 'ifx_baas_'

module.exports = {
  set: (key, value) => {
    try {
      wx.setStorageSync(storageKeyPrefix + key, value)
    } catch (e) {
      throw new Error(e)
    }
  },
  get: (key) => {
    try {
      return wx.getStorageSync(storageKeyPrefix + key)
    } catch (e) {
      throw new Error(e)
    }
  }
}
