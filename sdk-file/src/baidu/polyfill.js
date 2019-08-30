const constants = require('core-module/constants')
module.exports = BaaS => {
  Object.assign(BaaS._polyfill, {
    CLIENT_PLATFORM: 'BAIDU',
    setStorageSync(k, v) {
      return swan.setStorageSync(k, v)
    },
    getStorageSync(k) {
      return swan.getStorageSync(k)
    },
    getSystemInfoSync() {
      return swan.getSystemInfoSync()
    },
    checkLatestVersion() {
      let info = swan.getSystemInfoSync()
      if (info.platform === 'devtools') {
        BaaS.checkVersion({platform: 'baidu_miniapp'})
      }
    },
    linkBaidu(...args) {
      return BaaS.auth.linkBaidu(...args)
    },
    handleLoginSuccess(res, isAnonymous) {
      // 登录成功的 hook （login、loginWithWechat、register）调用成功后触发
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      BaaS.storage.set(constants.STORAGE_KEY.UNIONID, res.data.unionid || '')
      if (res.data.openid) {
        BaaS.storage.set(constants.STORAGE_KEY.USERINFO, {
          id: res.data.user_id,
          openid: res.data.openid,
          unionid: res.data.unionid,
        })
      }
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
      if (isAnonymous) {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 1)
      } else {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 0)
      }
    },
  })
}
