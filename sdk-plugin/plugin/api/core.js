const constants = require('./constants')
const storage = require('./storage')
const HError = require('./HError')
const utils = require('./utils')

module.exports = function (BaaS) {
  BaaS.init = (clientID) => {
    if (!utils.isString(clientID)) {
      throw new HError(605)
    }

    BaaS._config.CLIENT_ID = clientID
    BaaS._config.API_HOST = BaaS._polyfill.getAPIHost(clientID)
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

  // 暴露指定 BaaS 方法
  BaaS.ContentGroup = require('./ContentGroup')
  BaaS.File = require('./File')
  BaaS.FileCategory = require('./FileCategory')
  BaaS.GeoPoint = require('./GeoPoint')
  BaaS.GeoPolygon = require('./GeoPolygon')
  BaaS.getWXACode = require('./getWXACode')
  BaaS.invokeFunction = require('./invokeFunction')
  BaaS.invoke = require('./invokeFunction')
  BaaS.order = require('./order').order
  BaaS.Order = require('./order')
  BaaS.pay = require('./pay')
  BaaS.Query = require('./Query')
  BaaS.request = require('./request')
  BaaS.storage = require('./storage')
  BaaS.TableObject = require('./TableObject')
  BaaS.User = require('./User')
  BaaS.ErrorTracker = require('./errorTracker')
  // 初始化 BaaS 逻辑，添加更多的方法到 BaaS 对象
  require('./baasRequest').createRequestMethod()
}
