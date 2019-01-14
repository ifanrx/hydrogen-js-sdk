module.exports = function (BaaS) {
  Object.assign(BaaS._polyfill, {
    getSystemInfoSync: function () {
      return {
        platform: 'web'
      }
    },
    setStorageSync: function (k, v) {
      window.localStorage.setItem(k, JSON.stringify({value: v}))
    },
    getStorageSync: function (k) {
      try {
        return JSON.parse(window.localStorage.getItem(k)).value
      } catch (e) {
        return null
      }
    },
  })
}