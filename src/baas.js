/**
 * 挂在 BaaS 对象的方法和属性都会被暴露到客户端环境，所以要注意保持 BaaS 对象的干净、安全
 */

const constants = require('./constants')
const storage = require('./storage')
const utils = require('./utils')

const BaaS = global.BaaS || {}

BaaS._config = utils.getConfig()

// 初始化 SDK
BaaS.init = (clientID) => {
  if (Object.prototype.toString.apply(clientID) !== '[object String]') {
    throw new Error('非法 clientID')
  }

  BaaS._config.CLIENT_ID = clientID
}

BaaS.getAuthToken = () => {
  return storage.get(constants.STORAGE_KEY.AUTH_TOKEN)
}

BaaS.isLogined = () => {
  return storage.get(constants.STORAGE_KEY.IS_LOGINED_BAAS)
}

// 检测 BaaS 当前状态
BaaS.check = () => {
  if (!BaaS.getAuthToken()) {
    throw new Error('未认证客户端')
  }

  if (!BaaS.isLogined()) {
    throw new Error('未登录')
  }
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
  storage.set(constants.STORAGE_KEY.OPENID, '')
}

module.exports = BaaS
