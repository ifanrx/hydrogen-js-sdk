const BaaS = require('./baas')
const constants = require('./constants')
const HError = require('./HError')
const storage = require('./storage')
const utils = require('./utils')
const UserRecord = require('./UserRecord')

const API = BaaS._config.API

const login = data => {
  return BaaS.request({
    url: API.WEB.LOGIN,
    method: 'POST',
    data: data,
  }).then(utils.validateStatusCode).then(res => {
    storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
    storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
    storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
    return res
  })
}

const silentLogin = () => {
  return Promise.reject(new HError(605, 'silentLogin 方法未定义'))
}

const register = data => {
  return BaaS.request({
    url: API.WEB.REGISTER,
    method: 'POST',
    data: data,
  }).then(utils.validateStatusCode)
}


const logout = () => {
  return BaaS.request({
    url: API.LOGOUT,
    method: 'POST',
  }).then(res => {
    BaaS.clearSession()
    return utils.validateStatusCode(res)
  })
}

/**
 * 忘记密码，发送重置密码邮件
 */
const requestPasswordReset = () => {
  return BaaS.request({
    url: API.WEB.PASSWORD_RESET,
    method: 'POST',
  }).then(utils.validateStatusCode)
}


module.exports = {
  login,
  logout,
  silentLogin,
  requestPasswordReset,
  register,
  currentUser() {
    let cache = storage.get(constants.STORAGE_KEY.USERINFO)
    if (cache) return null
    return UserRecord.createCurrentUser(cache)
  }
}
