const constants = require('core-module/constants')
const HError = require('core-module/HError')
const utils = require('core-module/utils')
const AUTH_ERROR = 11

/**
 * 通过 forceLogin 判断是否为强制登录
 * scope 为 'auth_user'时，是主动授权，会弹出授权窗口
 * scope 为 'auth_base'时，不会弹出授权窗口
 *
 * 当有 userId 时，执行 linkAlipay 的操作
 */
const createAuthFn = BaaS => function auth({
  forceLogin,
  scopes = [],
  createUser = true,
  syncUserProfile = constants.UPDATE_USERPROFILE_VALUE.SETNX,
} = {}, userId) {
  scopes = Array.isArray(scopes) ? scopes : []
  let allScopes = forceLogin ? scopes.concat('auth_user') : 'auth_base'
  const handler = !userId
    ? createLoginHandlerFn(BaaS)
    : createUserAssociateFn(BaaS)
  return new Promise((resolve, reject) => {
    my.getAuthCode({
      scopes: allScopes,
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
    .then(code => handler(code, forceLogin, createUser, syncUserProfile))
    .catch(err => {
      // 当用户取消授权后，执行静默登录
      if ((err.error && err.error === AUTH_ERROR)
        // 兼容开发工具上用户取消授权的操作
        || (err.authErrorScope && err.authErrorScope.scope)) {
        return auth(false, userId)
      } else {
        throw err
      }
    })
}

const createLoginHandlerFn = BaaS => (code, forceLogin, createUser, syncUserProfile) => {
  const API = BaaS._config.API
  const url = forceLogin ? API.ALIPAY.AUTHENTICATE : API.ALIPAY.SILENT_LOGIN
  const data = {
    code,
    create_user: createUser,
  }
  if (forceLogin) {
    data.update_userprofile = utils.getUpdateUserProfileParam(syncUserProfile)
  }
  return BaaS.request({
    url,
    method: 'POST',
    data,
  }).then(res => {
    if (res.status == constants.STATUS_CODE.CREATED) {
      let _res = {
        ...res,
        data: {
          ...res.data.user_info,
          ...res.data,
          alipay_user_id: res.data.user_info._provider.alipay.user_id,
          user_id: res.data.user_info.id,
          expired_at: Math.floor(Date.now() / 1000) + res.data.expires_in - 30,
        }
      }
      BaaS._polyfill.handleLoginSuccess(_res)
      return _res
    } else {
      throw new HError(res.status, require('./request').extractErrorMsg(res))
    }
  })
}

const createUserAssociateFn = BaaS => (code, forceLogin, _, syncUserProfile) => {
  const API = BaaS._config.API
  const data = {
    code,
    authorized: forceLogin,
  }
  if (forceLogin) {
    data.update_userprofile = utils.getUpdateUserProfileParam(syncUserProfile)
  }
  return BaaS.request({
    url: API.ALIPAY.USER_ASSOCIATE,
    method: 'PUT',
    data,
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
