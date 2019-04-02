const BaaS = require('./baas')
const constants = require('./constants')
const HError = require('./HError')
const storage = require('./storage')
const utils = require('./utils')
const UserRecord = require('./UserRecord')
const User = require('./User')

const API = BaaS._config.API

const login = data => {
  let url = data.username ? API.WEB.LOGIN_USERNAME : API.WEB.LOGIN_EMAIL
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
    url: API.WEB.ANONYMOUS_LOGIN,
    method: 'POST',
  }).then(utils.validateStatusCode).then(res => {
    BaaS._polyfill.handleLoginSuccess(res)
    storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 1)
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
  let url = data.username ? API.WEB.REGISTER_USERNAME : API.WEB.REGISTER_EMAIL
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
    url: API.WEB.PASSWORD_RESET,
    method: 'POST',
    data: {email},
  }).then(utils.validateStatusCode)
}

const getCurrentUser = () => {
  let uid = storage.get(constants.STORAGE_KEY.UID)
  if (!uid) return Promise.reject(new HError(604))

  return new User().get(uid).then(res => {
    let user = UserRecord.initCurrentUser(res.data)
    user.user_id = res.data.id
    return user
  })
}

module.exports = {
  login: utils.rateLimit(login),
  logout,
  silentLogin,
  anonymousLogin: utils.rateLimit(anonymousLogin),
  requestPasswordReset,
  register: utils.rateLimit(register),
  getCurrentUser: utils.rateLimit(getCurrentUser),
}
