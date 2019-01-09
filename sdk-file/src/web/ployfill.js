module.exports = function (BaaS) {
  Object.assign(BaaS._polyfill, {
    getSystemInfoSync: function () {
      return {
        platform: 'web'
      }
    },
    getNetworkType: function () {

    },

    setStorageSync: '',
    getStorageSync: '',


  })
}