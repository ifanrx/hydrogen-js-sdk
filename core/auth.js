const BaaS = require('./baas')
const constants = require('./constants')
const HError = require('./HError')
const storage = require('./storage')
const utils = require('./utils')
const UserRecord = require('./UserRecord')
const User = require('./User')

const API = BaaS._config.API

function getAuthUrlAndAdjustRequestData(data, isLoginFunc) {
  if (data.mobilePhone) {
    delete data.username
    delete data.email
    return isLoginFunc ? API.LOGIN_PHONE : API.REGISTER_PHONE
  } else if (data.email) {
    delete data.username
    delete data.mobilePhone
    return isLoginFunc ? API.LOGIN_EMAIL : API.REGISTER_EMAIL
  } else {
    data.username = data.username || ''
    delete data.email
    delete data.mobilePhone
    return isLoginFunc ? API.LOGIN_USERNAME : API.REGISTER_USERNAME
  }
}

const login = data => {
  let url = getAuthUrlAndAdjustRequestData(data, true)
  return BaaS.request({
    url,
    method: 'POST',
    data: data,
  }).then(utils.validateStatusCode).then(res => {
    BaaS._polyfill.handleLoginSuccess(res)
    return getCurrentUser()
  })
}

/**
 * 匿名登录
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
 */
const silentLogin = () => {
  return Promise.reject(new HError(605, 'silentLogin 方法未定义'))
}

const register = data => {
  let url = getAuthUrlAndAdjustRequestData(data)
  return BaaS.request({
    url,
    method: 'POST',
    data: data,
  }).then(utils.validateStatusCode).then(res => {
    BaaS._polyfill.handleLoginSuccess(res)
    return getCurrentUser()
  })
}


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
 */
const requestPasswordReset = ({email} = {}) => {
  return BaaS.request({
    url: API.PASSWORD_RESET,
    method: 'POST',
    data: {email},
  }).then(utils.validateStatusCode)
}

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

const loginWithMobilePhoneSmsCode = (mobilePhone, smsCode) => {
  return BaaS.request({
    url: API.LOGIN_SMS,
    data: {phone: mobilePhone, code: smsCode},
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
  loginWithMobilePhoneSmsCode: utils.rateLimit(loginWithMobilePhoneSmsCode),
  anonymousLogin: utils.rateLimit(anonymousLogin),
  requestPasswordReset,
  register: utils.rateLimit(register),
  getCurrentUser: utils.rateLimit(getCurrentUser),
}
