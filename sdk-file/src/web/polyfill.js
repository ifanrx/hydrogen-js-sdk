module.exports = function (BaaS) {
  Object.assign(BaaS._polyfill, {
    getSystemInfoSync: function () {
      return {
        platform: 'web'
      }
    },
    setStorageSync: function (k, v) {
      window.localStorage.setItem(k, v)
    },
    getStorageSync: function (k) {
      return window.localStorage.getItem(k)
    },
  })
}