const utils = require('core-module/utils')
const constants = require('core-module/constants')
const HError = require('core-module/HError')
const createAuthFn = require('./createAuthFn')

let loginPromise = {
  silent: null,
  force: null,
}

const hasUserLogined = function (BaaS) {
  const uid = BaaS.storage.get(constants.STORAGE_KEY.UID)
  const token = BaaS.storage.get(constants.STORAGE_KEY.AUTH_TOKEN)
  return !!uid && !!token && !utils.isSessionExpired()
}

const createLoginFn = BaaS => opts => {
  const isForceLogin = !!opts && !!opts.forceLogin
  const auth = createAuthFn(BaaS)
  if (hasUserLogined(BaaS)) {
    return Promise.resolve()
  }
  const loginType = isForceLogin ? 'force' : 'silent'
  if (loginPromise[loginType]) {
    return loginPromise[loginType]
  }
  loginPromise[loginType] = auth(isForceLogin)
    .then(res => {
      loginPromise[loginType] = null
      return res
    })
    .catch(err => {
      loginPromise[loginType] = null
      throw err
    })
  return loginPromise[loginType]
}

const fnUnsupportedHandler = () => {
  throw new HError(611)
}

module.exports = function (BaaS) {
  const login = createLoginFn(BaaS)
  BaaS.auth = Object.assign({}, BaaS.auth, {
    silentLogin: login.bind(null, {forceLogin: false}),
    loginWithAlipay: opts => login(opts).then(BaaS.auth.currentUser),
    login: fnUnsupportedHandler,
    anonymousLogin: fnUnsupportedHandler,
    requestPasswordReset: fnUnsupportedHandler,
    register: fnUnsupportedHandler,
  })
}
