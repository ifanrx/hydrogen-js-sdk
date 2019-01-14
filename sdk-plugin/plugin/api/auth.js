const BaaS = require('./baas')
const constants = require('./constants')
const HError = require('./HError')
const storage = require('./storage')
const utils = require('./utils')
const polyfill = BaaS._polyfill

const API = BaaS._config.API

const login = (opts) => {
}

const silentLogin = () => {
  throw new Error('silentLogin 方法未定义')
}

const register = (opts) => {
}

const requestActivation = (opts) => {

}

const activateUser = (opts) => {

}

const requestPasswordReset = (opts) => {

}

const changePassword = (opts) => {

}

const bindAccount = (opts) => {

}

const logout = () => {
  return BaaS.request({url: API.LOGOUT, method: 'POST'}).then(() => {
    BaaS.clearSession()
  })
}


module.exports = {
  login,
  logout,
  silentLogin,
  register,
  requestActivation,
  activateUser,
  requestPasswordReset,
  changePassword,
  bindAccount,
}
