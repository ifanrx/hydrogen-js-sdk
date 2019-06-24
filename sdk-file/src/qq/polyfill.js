const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const constants = require('core-module/constants')
module.exports = BaaS => {
  Object.assign(BaaS._polyfill, {
    CLIENT_PLATFORM: 'QQ',
    setStorageSync(k, v) {
      return qq.setStorageSync(k, v)
    },
    getStorageSync(k) {
      return qq.getStorageSync(k)
    },
    getSystemInfoSync() {
      return qq.getSystemInfoSync()
    },
    checkLatestVersion() {
      let info = qq.getSystemInfoSync()
      if (info.platform === 'devtools') {
        BaaS.checkVersion({platform: 'qq_miniapp'})
      }
    },
    linkQQ(...args) {
      return BaaS.auth.linkQQ(...args)
    },
    handleLoginSuccess(res, isAnonymous) {
      // 登录成功的 hook （login、loginWithWechat、register）调用成功后触发
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      BaaS.storage.set(constants.STORAGE_KEY.UNIONID, res.data.unionid || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      if (res.data.openid) {
        BaaS.storage.set(constants.STORAGE_KEY.USERINFO, {
          id: res.data.user_id,
          openid: res.data.openid,
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
