const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const constants = require('core-module/constants')
const utils = require('core-module/utils')

module.exports = BaaS => {
  Object.assign(BaaS._polyfill, {
    CLIENT_PLATFORM: 'QQ',
    setStorageSync(k, v) {
      return utils.withRetry(qq.setStorageSync)(k, v)
    },
    getStorageSync(k) {
      return utils.withRetry(qq.getStorageSync)(k)
    },
    getSystemInfoSync() {
      return qq.getSystemInfoSync()
    },
    checkLatestVersion() {
      let info = qq.getSystemInfoSync()
      if (info.platform === 'devtools') {
        BaaS.checkVersion({platform: constants.PLATFORM.QQ})
      }
    },
    linkQQ(...args) {
      return BaaS.auth.linkQQ(...args)
    },
    handleLoginSuccess(res, isAnonymous, userInfo) {
      // 登录成功的 hook （login、loginWithWechat、register）调用成功后触发
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      BaaS.storage.set(constants.STORAGE_KEY.UNIONID, res.data.unionid || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      if (res.data.openid) {
        BaaS.storage.set(
          constants.STORAGE_KEY.USERINFO,
          Object.assign({}, BaaS.storage.get(constants.STORAGE_KEY.USERINFO), userInfo || {
            id: res.data.user_id,
            openid: res.data.openid,
            unionid: res.data.unionid,
          })
        )
      }
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
      if (isAnonymous) {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 1)
      } else {
        BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 0)
        tplMsgStatsReport.reportStats()
      }
    },
  })
}
