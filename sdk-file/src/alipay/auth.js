const utils = require('core-module/utils')
const constants = require('core-module/constants')
const HError = require('core-module/HError')
const createAuthFn = require('./createAuthFn')

let isLogining = false
let loginResolve = []
let loginReject = []
let isSilentLogining = false
let silentLoginResolve = []
let silentLoginReject = []

const resolveLoginCallBacks = (storage, isForceLogin) => {
  let resolves = isForceLogin ? loginResolve : silentLoginResolve
  setTimeout(() => {
    while (resolves.length) {
      resolves.shift()(makeLoginResponseData(storage, isForceLogin))
    }
  }, 0)
}

const rejectLoginCallBacks = (err, isForceLogin) => {
  let rejects = isForceLogin ? loginReject : silentLoginReject
  setTimeout(() => {
    while (rejects.length) {
      rejects.shift()(err)
    }
  }, 0)
}

const makeLoginResponseData = (storage, isForceLogin) => {
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

const createLoginFn = BaaS => opts => {
  const isForceLogin = !!opts && !!opts.forceLogin
  const auth = createAuthFn(BaaS)
  let resolves = isForceLogin ? loginResolve : silentLoginResolve
  let rejects = isForceLogin ? loginReject : silentLoginReject
  if ((isForceLogin && BaaS.storage.get(constants.STORAGE_KEY.USERINFO) && !utils.isSessionExpired())
    || (!isForceLogin && BaaS.storage.get(constants.STORAGE_KEY.UID) && !utils.isSessionExpired())) {
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

const fnUnsupportedHandler = () => {
  throw new HError(611)
}

module.exports = function (BaaS) {
  const login = createLoginFn(BaaS)
  BaaS.auth = Object.assign({}, BaaS.auth, {
    silentLogin: login.bind(null, {forceLogin: false}),
    loginWithAlipay: login,
    login: fnUnsupportedHandler,
    anonymousLogin: fnUnsupportedHandler,
    requestPasswordReset: fnUnsupportedHandler,
    register: fnUnsupportedHandler,
  })
}
