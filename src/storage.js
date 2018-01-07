const storageKeyPrefix = 'ifx_baas_'

module.exports = {
  set: (key, value) => {
    wx.setStorageSync(storageKeyPrefix + key, value)
  },
  get: (key) => {
    return wx.getStorageSync(storageKeyPrefix + key)
  }
}
