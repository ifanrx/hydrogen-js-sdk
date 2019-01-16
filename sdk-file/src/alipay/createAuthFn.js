const constants = require('core-module/constants')
const HError = require('core-module/HError')

/**
 * 通过 isForceLogin 判断是否为强制登录
 * scope 为 'auth_user'时，是主动授权，会弹出授权窗口
 * scope 为 'auth_base'时，不会弹出授权窗口
 */
const createAuthFn = BaaS => (isForceLogin, userId) => {
  const scope = isForceLogin ? 'auth_user' : 'auth_base'
  const handler = createLoginHandlerFn(BaaS, isForceLogin)
  return new Promise((resolve, reject) => {
    my.getAuthCode({
      scopes: scope,
      success: res => {
        if (res.authCode) {
          resolve(res.authCode)
        } else {
          reject(res.authErrorScope)
        }
      },
      fail: res => reject,
    })
  }).then(code => handler(code, isForceLogin, userId))
}

const createLoginHandlerFn = BaaS => (code, isForceLogin, userId) => {
  const API = BaaS._config.API
  const url = isForceLogin ? API.ALIPAY.AUTHENTICATE : API.ALIPAY.SILENT_LOGIN
  return BaaS.request({
    url,
    method: 'POST',
    data: { code, user_id: userId },
  }).then(res => {
    if (res.statusCode == constants.STATUS_CODE.CREATED) {
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.ALIPAY_USER_ID, res.data.alipay_user_id || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      BaaS.storage.set(constants.STORAGE_KEY.USERINFO, res.data.user_info)
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
      return res
    } else {
      throw new HError(res.statusCode, BaaS.request.extractErrorMsg(res))
    }
  })
}

module.exports = createAuthFn
