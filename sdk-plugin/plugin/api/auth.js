const BaaS = require('./baas')
const constants = require('./constants')
const HError = require('./HError')
const storage = require('./storage')
const utils = require('./utils')
const UserRecord = require('./UserRecord')
const User = require('./User')

const API = BaaS._config.API

let loginPromise = null
let getUserPromise = null
// let anonymousLoginPromise = null

const login = data => {
  if (!loginPromise) {
    loginPromise = BaaS.request({
      url: API.WEB.LOGIN,
      method: 'POST',
      data: data,
    }).then(utils.validateStatusCode).then(res => {
      storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
      loginPromise = null
      return currentUser()
    }, err => {
      loginPromise = null
      throw err
    })
  }
  return loginPromise
}

/**
 * 匿名登录
 */
const anonymousLogin = () => {
  return Promise.resolve()
  // TODO::匿名登录逻辑，目前直接 resolve
  // if (!anonymousLoginPromise) {
  //   anonymousLoginPromise = BaaS.request({
  //     url: API.WEB.ANONYMOUS_LOGIN,
  //     method: 'POST',
  //   }).then(utils.validateStatusCode).then(res => {
  //     storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
  //     storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
  //     storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, '1')
  //     storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
  //     anonymousLoginPromise = null
  //     return res.data
  //   })
  // }
  // return anonymousLoginPromise
}

/**
 * 静默登录
 */
const silentLogin = () => {
  return Promise.reject(new HError(605, 'silentLogin 方法未定义'))
}

const register = data => {
  return BaaS.request({
    url: API.WEB.REGISTER,
    method: 'POST',
    data: data,
  }).then(utils.validateStatusCode).then(res => res.data)
}


const logout = () => {
  return BaaS.request({
    url: API.LOGOUT,
    method: 'POST',
  }).then(res => {
    return utils.validateStatusCode(res)
  }).then(res => {
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
  }).then(utils.validateStatusCode).then(res => res.data)
}

const currentUser = () => {
  let uid = storage.get(constants.STORAGE_KEY.UID)
  if (!uid) return Promise.resolve(null)

  if (!getUserPromise) {
    getUserPromise = new User().get(uid).then(res => {
      let user = UserRecord.initCurrentUser(res.data)
      user.user_id = res.data.id
      getUserPromise = null
      return user
    }, err => {
      getUserPromise = null
      throw err
    })
  }

  return getUserPromise
}

module.exports = {
  login,
  logout,
  silentLogin,
  anonymousLogin,
  requestPasswordReset,
  register,
  currentUser,
}
