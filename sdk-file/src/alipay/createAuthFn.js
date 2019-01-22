const constants = require('core-module/constants')
const HError = require('core-module/HError')

/**
 * 通过 isForceLogin 判断是否为强制登录
 * scope 为 'auth_user'时，是主动授权，会弹出授权窗口
 * scope 为 'auth_base'时，不会弹出授权窗口
 *
 * 当有 userId 时，执行 linkAlipay 的操作
 */
const createAuthFn = BaaS => function auth(isForceLogin, userId) {
  const scope = isForceLogin ? 'auth_user' : 'auth_base'
  const handler = !userId
    ? createLoginHandlerFn(BaaS)
    : createUserAssociateFn(BaaS)
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
      fail: res => reject(res),
    })
  })
    .catch(err => {
      // 当用户取消授权后，执行静默登录
      if ((err.error && err.error === 11)
        // 兼容开发工具上用户取消授权的操作
        || (err.authErrorScope && err.authErrorScope.scope && /用户取消授权/.test(err.authErrorScope.scope))) {
        return auth(false, userId)
      } else {
        throw err
      }
    })
    .then(code => handler(code, isForceLogin))
}

const createLoginHandlerFn = BaaS => (code, isForceLogin) => {
  const API = BaaS._config.API
  const url = isForceLogin ? API.ALIPAY.AUTHENTICATE : API.ALIPAY.SILENT_LOGIN
  return BaaS.request({
    url,
    method: 'POST',
    data: { code },
  }).then(res => {
    if (res.status == constants.STATUS_CODE.CREATED) {
      BaaS.storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      BaaS.storage.set(constants.STORAGE_KEY.ALIPAY_USER_ID, res.data.alipay_user_id || '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
      return res
    } else {
      throw new HError(res.statusCode, require('./request').extractErrorMsg(res))
    }
  })
}

const createUserAssociateFn = BaaS => (code, isForceLogin) => {
  const API = BaaS._config.API
  return BaaS.request({
    url: API.ALIPAY.USER_ASSOCIATE,
    method: 'PUT',
    data: { code, authorized: isForceLogin },
  }).then(res => {
    if (res.status == constants.STATUS_CODE.UPDATE) {
      BaaS.storage.set(constants.STORAGE_KEY.ALIPAY_USER_ID, res.data.alipay_user_id || '')
      return res
    } else {
      throw new HError(res.statusCode, require('./request').extractErrorMsg(res))
    }
  })
}

module.exports = createAuthFn
