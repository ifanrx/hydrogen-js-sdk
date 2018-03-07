/**
 * 挂在 BaaS 对象的方法和属性都会被暴露到客户端环境，所以要注意保持 BaaS 对象的干净、安全
 */

const constants = require('./constants')
const HError = require('./HError')
const storage = require('./storage')
const utils = require('./utils')
const _isString = require('lodash/isString')

const BaaS = global.BaaS || {}

BaaS._config = utils.getConfig()

BaaS.init = (clientID) => {
  if (!_isString(clientID)) {
    throw new HError(605)
  }

  BaaS._config.CLIENT_ID = clientID
  BaaS._config.API_HOST = `https://${clientID}.xiaoapp.io`
}

BaaS.getAuthToken = () => {
  return storage.get(constants.STORAGE_KEY.AUTH_TOKEN)
}

BaaS.isLogined = () => {
  return storage.get(constants.STORAGE_KEY.IS_LOGINED_BAAS)
}

BaaS.clearSession = () => {
  // 清除客户端认证 Token
  storage.set(constants.STORAGE_KEY.AUTH_TOKEN, '')
  // 清除 BaaS 登录状态
  storage.set(constants.STORAGE_KEY.IS_LOGINED_BAAS, '')
  // 清除用户信息
  storage.set(constants.STORAGE_KEY.USERINFO, '')
  storage.set(constants.STORAGE_KEY.UID, '')
  storage.set(constants.STORAGE_KEY.OPENID, '')
  storage.set(constants.STORAGE_KEY.UNIONID, '')
}

module.exports = BaaS
