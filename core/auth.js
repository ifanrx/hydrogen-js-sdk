const BaaS = require('./baas')
const constants = require('./constants')
const HError = require('./HError')
const storage = require('./storage')
const utils = require('./utils')
const UserRecord = require('./UserRecord')
const User = require('./User')

/**
 * 用户认证
 * @namespace auth
 * @memberof BaaS
 */

const API = BaaS._config.API

function getAuthUrl(data, isLoginFunc) {
  if (data.phone) {
    return isLoginFunc ? API.LOGIN_PHONE : API.REGISTER_PHONE
  }
  if (data.email) {
    return isLoginFunc ? API.LOGIN_EMAIL : API.REGISTER_EMAIL
  }
  return isLoginFunc ? API.LOGIN_USERNAME : API.REGISTER_USERNAME
}

function getAuthRequestData(data) {
  if (data.phone) {
    return {
      phone: data.phone,
      password: data.password,
    }
  }
  if (data.email) {
    return {
      email: data.email,
      password: data.password,
    }
  }
  return {
    username: data.username || '',
    password: data.password,
  }
}

/**
 * 登录
 * @since v2.0.0
 * @memberof BaaS.auth
 * @param {(BaaS.AuthWithUsernameOptions|BaaS.AuthWithEmailOptions|BaaS.AuthWithPhoneOptions)} options
 * @return {Promise<BaaS.CurrentUser>}
 */
const login = params => {
  let url = getAuthUrl(params, true)
  let data = getAuthRequestData(params)
  return BaaS.request({
    url,
    method: 'POST',
    data,
  }).then(utils.validateStatusCode).then(res => {
    BaaS._polyfill.handleLoginSuccess(res)
    return getCurrentUser()
  })
}

/**
 * 匿名登录
 * @since v2.0.0
 * @memberof BaaS.auth
 * @return {Promise<BaaS.CurrentUser>}
 */
const anonymousLogin = () => {
  return BaaS.request({
    url: API.ANONYMOUS_LOGIN,
    method: 'POST',
  }).then(utils.validateStatusCode).then(res => {
    BaaS._polyfill.handleLoginSuccess(res, true)
    return getCurrentUser()
  })
}

/**
 * 静默登录
 * @since v2.0.0
 * @memberof BaaS.auth
 * @return {Promise<BaaS.CurrentUser>}
 */
const silentLogin = () => {
  return Promise.reject(new HError(605, 'silentLogin 方法未定义'))
}

/**
 * 注册
 * @since v2.0.0
 * @memberof BaaS.auth
 * @param {(BaaS.AuthWithUsernameOptions|BaaS.AuthWithEmailOptions|BaaS.AuthWithPhoneOptions)} options
 * @return {Promise<BaaS.CurrentUser>}
 */
const register = params => {
  let url = getAuthUrl(params)
  let data = getAuthRequestData(params)
  return BaaS.request({
    url,
    method: 'POST',
    data,
  }).then(utils.validateStatusCode).then(res => {
    BaaS._polyfill.handleLoginSuccess(res)
    return getCurrentUser()
  })
}


/**
 * 退出登录状态
 * @since v2.0.0
 * @memberof BaaS.auth
 * @return {Promise<BaaS.Response<any>>}
 */
const logout = () => {
  return BaaS.request({
    url: API.LOGOUT,
    method: 'POST',
  }).then(utils.validateStatusCode).then(res => {
    BaaS.clearSession()
    return res
  })
}

/**
 * 忘记密码，发送重置密码邮件
 * @since v2.0.0
 * @memberof BaaS.auth
 * @param {BaaS.PasswordResetParam} param 账号信息
 * @return {Promise<BaaS.Response<any>>}
 */
const requestPasswordReset = ({email} = {}) => {
  return BaaS.request({
    url: API.PASSWORD_RESET,
    method: 'POST',
    data: {email},
  }).then(utils.validateStatusCode)
}

/**
 * 获取当前用户
 * @since v2.0.0
 * @memberof BaaS.auth
 * @return {Promise<BaaS.CurrentUser>}
 */
let getCurrentUser = () => {
  let uid = storage.get(constants.STORAGE_KEY.UID)
  let expiresAt = storage.get(constants.STORAGE_KEY.EXPIRES_AT)
  if (!uid || !expiresAt || utils.isSessionExpired()) return Promise.reject(new HError(604))

  return new User().get(uid).then(res => {
    let user = UserRecord.initCurrentUser(res.data)
    user.user_id = res.data.id
    user.session_expires_at = expiresAt
    return user
  })
}

/**
 * 使用手机号 + 验证码登录
 * @since v2.0.0
 * @memberof BaaS.auth
 * @param {string} mobilePhone 手机号码
 * @param {string} smsCode 验证码
 * @param {BaaS.LoginOptions} [options] 可选配置
 * @return {Promise<BaaS.CurrentUser>}
 */
const loginWithSmsVerificationCode = (mobilePhone, smsCode, {createUser = true} = {}) => {
  return BaaS.request({
    url: API.LOGIN_SMS,
    data: {phone: mobilePhone, code: smsCode, create_user: createUser},
    method: 'POST',
  }).then(utils.validateStatusCode).then(res => {
    BaaS._polyfill.handleLoginSuccess(res, false)
    return getCurrentUser()
  })
}

module.exports = {
  login: utils.rateLimit(login),
  logout,
  silentLogin,
  loginWithSmsVerificationCode: utils.rateLimit(loginWithSmsVerificationCode),
  anonymousLogin: utils.rateLimit(anonymousLogin),
  requestPasswordReset,
  register: utils.rateLimit(register),
  getCurrentUser: utils.rateLimit(getCurrentUser),
}
