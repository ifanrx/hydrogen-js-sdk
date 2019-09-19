const BaaS = require('./baas')
const constants = require('./constants')
const HError = require('./HError')
const storage = require('./storage')
const utils = require('./utils')
const UserRecord = require('./UserRecord')
const User = require('./User')

/**
 * @interface auth
 */

/**
 * @typedef LoginOptions
 * @property {boolean} [createUser] 是否创建用户
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
 * @typedef AuthWithUsernameOptions
 * @property username {string} 用户名
 * @property password {string} 密码
 */
/**
 * @typedef AuthWithEmailOptions
 * @property email {string} 邮箱
 * @property password {string} 密码
 */
/**
 * @typedef AuthWithPhoneOptions
 * @property phone {string} 手机号码
 * @property password {string} 密码
 */
/**
 * 登录
 *
 * @memberof auth
 * @param {(AuthWithUsernameOptions|AuthWithEmailOptions|AuthWithPhoneOptions)} options
 * @return {Promise<CurrentUser>}
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
 *
 * @memberof auth
 * @return {Promise<CurrentUser>}
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
 *
 * @memberof auth
 * @return {Promise<CurrentUser>}
 */
const silentLogin = () => {
  return Promise.reject(new HError(605, 'silentLogin 方法未定义'))
}

/**
 * 注册
 *
 * @memberof auth
 * @param {(AuthWithUsernameOptions|AuthWithEmailOptions|AuthWithPhoneOptions)} options
 * @return {Promise<CurrentUser>}
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
 *
 * @memberof auth
 * @return {Promise}
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
 *
 * @memberof auth
 * @return {Promise<any>}
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
 *
 * @memberof auth
 * @return {Promise<CurrentUser>}
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
 *
 * @memberof auth
 * @param {string} mobilePhone 手机号码
 * @param {string} smsCode 验证码
 * @param {LoginOptions} options
 * @return {Promise<CurrentUser>}
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
