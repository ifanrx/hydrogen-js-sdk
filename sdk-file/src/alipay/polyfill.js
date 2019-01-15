const HError = require('core-module/HError')

module.exports = function (BaaS) {
  Object.assign(BaaS._polyfill, {
    getSystemInfoSync: function () {
      return my.getSystemInfoSync()
    },

    setStorageSync: function (key, value) {
      return my.setStorageSync({
        key,
        data: value,
      })
    },

    getStorageSync: function (key) {
      return my.getStorageSync({
        key,
      })
    },

    linkAlipay: function (userId, code) {
      const API = BaaS._config.API
      return BaaS.request({
        url: API.ALIPAY.SILENT_LOGIN,
        method: 'POST',
        data: { user_id: userId, code },
      }).then(res => {
        if (res.statusCode == constants.STATUS_CODE.CREATED) {
          BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
          BaaS.storage.set(constants.STORAGE_KEY.ALIPAY_USER_ID, res.data.alipay_user_id || '')
          BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
          BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
          return res
        } else {
          throw new HError(res.statusCode, BaaS.request.extractErrorMsg(res))
        }
      })
    },
  })
}
