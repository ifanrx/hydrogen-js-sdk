const utils = require('core-module/utils')
const constants = require('core-module/constants')
const HError = require('core-module/HError')

let isLogining = false
let loginResolve = []
let loginReject = []
let isSilentLogining = false
let silentLoginResolve = []
let silentLoginReject = []

const resolveLoginCallBacks = (storage, isForceLogin = true) => {
  let resolves = isForceLogin ? loginResolve : silentLoginResolve
  setTimeout(() => {
    while (resolves.length) {
      resolves.shift()(makeLoginResponseData(storage, isForceLogin))
    }
  }, 0)
}

const rejectLoginCallBacks = (err, isForceLogin = true) => {
  let rejects = isForceLogin ? loginReject : silentLoginReject
  setTimeout(() => {
    while (rejects.length) {
      rejects.shift()(err)
    }
  }, 0)
}

const makeLoginResponseData = (storage, isForceLogin = true) => {
  if (isForceLogin) {
    return Object.assign({
      id: storage.get(constants.STORAGE_KEY.UID),
      [constants.STORAGE_KEY.ALIPAY_USER_ID]: storage.get(constants.STORAGE_KEY.ALIPAY_USER_ID),
      [constants.STORAGE_KEY.EXPIRES_AT]: storage.get(constants.STORAGE_KEY.EXPIRES_AT),
    }, storage.get(constants.STORAGE_KEY.USERINFO))
  }
  return {
    id: storage.get(constants.STORAGE_KEY.UID),
    [constants.STORAGE_KEY.ALIPAY_USER_ID]: storage.get(constants.STORAGE_KEY.ALIPAY_USER_ID),
    [constants.STORAGE_KEY.EXPIRES_AT]: storage.get(constants.STORAGE_KEY.EXPIRES_AT)
  }
}

/**
 * 通过 isForceLogin 判断是否为强制登录
 * scope 为 'auth_user'时，是主动授权，会弹出授权窗口
 * scope 为 'auth_base'时，不会弹出授权窗口
 */
const createAuthFn = BaaS => (isForceLogin = true) => {
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
  }).then(code => handler(code, isForceLogin))
}

const createLoginHandlerFn = BaaS => (code, isForceLogin) => {
  const API = BaaS._config.API
  const url = isForceLogin ? API.ALIPAY.AUTHENTICATE : API.ALIPAY.SILENT_LOGIN
  return BaaS.request({
    url,
    method: 'POST',
    data: { code },
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

const createLoginFn = BaaS = (isForceLogin = true) => {
  const auth = createAuthFn(BaaS)
  let resolves = isForceLogin ? loginResolve : silentLoginResolve
  let rejects = isForceLogin ? loginReject : silentLoginReject
  if ((isForceLogin && BaaS.storage.get(constants.STORAGE_KEY.USERINFO) && !utils.isSessionExpired())
    || (!isForceLogin && storage.get(constants.STORAGE_KEY.UID) && !utils.isSessionExpired())) {
    return Promise.resolve(makeLoginResponseData(BaaS.storage, isForceLogin))
  }
  return new Promise((resolve, reject) => {
    resolves.push(resolve)
    rejects.push(reject)
    if ((!isLogining && isForceLogin) || (!isSilentLogining && !isForceLogin)) {
      if (isForceLogin) {
        isLogining = true
      } else {
        isSilentLogining = true
      }
      auth(isForceLogin)
        .then(() => resolveLoginCallBacks(BaaS.storage, isForceLogin))
        .catch(err => rejectLoginCallBacks(err, isForceLogin))
        .then(() => {
          if (isForceLogin) {
            isLogining = false
          } else {
            isSilentLogining = false
          }
        })
    }
  })
}

module.exports = function (BaaS) {
  const login = createLoginFn(BaaS)
  BaaS.auth = {
    ...BaaS.auth,
    silentLogin: login.bind(null, false)
    loginWithAlipay: login,
  }
}
