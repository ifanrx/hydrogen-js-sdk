const utils = require('core-module/utils')
const constants = require('core-module/constants')
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

const createLoginFn = BaaS => (opts = {}) => {
  const forceLogin = !!opts && !!opts.forceLogin
  const auth = createAuthFn(BaaS)
  if (hasUserLogined(BaaS)) {
    return Promise.resolve()
  }
  const loginType = forceLogin ? 'force' : 'silent'
  if (loginPromise[loginType]) {
    return loginPromise[loginType]
  }
  loginPromise[loginType] = auth(opts)
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

module.exports = function (BaaS) {
  const login = createLoginFn(BaaS)
  BaaS.auth.silentLogin = login.bind(null, {forceLogin: false})

  /**
   * 支付宝登录
   * @function
   * @memberof BaaS.auth
   * @param {BaaS.LoginWithAlipayParams} [options] 登录参数
   * @return {Promise<BaaS.CurrentUser>}
   */
  BaaS.auth.loginWithAlipay = opts => login(opts).then(BaaS.auth.getCurrentUser)
}
