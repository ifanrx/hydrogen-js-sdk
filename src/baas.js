/**
 * 挂在 BaaS 对象的方法和属性都会被暴露到客户端环境，所以要注意保持 BaaS 对象的干净、安全
 */

const constants = require('./constants')
const HError = require('./HError')
const storage = require('./storage')
const utils = require('./utils')
const polyfill = require('./polyfill')

const BaaS = global.BaaS || {}

BaaS._config = utils.getConfig()

BaaS.init = (clientID) => {
  if (!utils.isString(clientID)) {
    throw new HError(605)
  }

  BaaS._config.CLIENT_ID = clientID
  BaaS._config.API_HOST = polyfill.getAPIHost(clientID)
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

BaaS.wxExtend = (...args) => {
  if (args.length < 1) {
    throw new HError(605)
  }

  if (utils.isObject(args[0])) {
    BaaS.wxLogin = args[0].wxLogin
    BaaS.wxGetUserInfo = args[0].wxGetUserInfo
    BaaS.wxPaymentRequest = args[0].wxPaymentRequest
  } else {
    const valiadFunc = ['wxLogin', 'wxGetUserInfo', 'wxPaymentRequest']
    let len = args.length > valiadFunc.length ? valiadFunc.length : args.length

    for(let i = 0; i < len; i++) {
      if (utils.isFunction(args[i])) {
        BaaS[valiadFunc[i]] = args[i]
      } else {
        throw new HError(605)
      }
    }
  }
}

module.exports = BaaS
