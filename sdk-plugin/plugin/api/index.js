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
    BaaS.checkLatestVersion()
  }

  BaaS.getAuthToken = () => {
    return storage.get(constants.STORAGE_KEY.AUTH_TOKEN)
  }

  BaaS.checkLatestVersion = function () {
    return BaaS.request({url: BaaS._config.API.LATEST_VERSION}).then(res => {
      let result = utils.checkVersion(BaaS._config.VERSION, res.data.version)
      if (result === -1) {
        console.log(`当前 SDK 最新版本为 ${res.data.version}，请前往 ${BaaS._config.SDK_DOWNLOAD_PAGE} 下载。`)
      }
    })
  }

  BaaS.clearSession = () => {
    // 清除客户端认证 Token
    storage.set(constants.STORAGE_KEY.AUTH_TOKEN, '')
    // 清除 BaaS 登录状态
    storage.set(constants.STORAGE_KEY.IS_LOGINED_BAAS, '')
    storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, '')
    // 清除用户信息
    storage.set(constants.STORAGE_KEY.USERINFO, '')
    storage.set(constants.STORAGE_KEY.UID, '')
  }

  // 遍历 METHOD_MAP_LIST，对每个 methodMap 调用 doCreateRequestMethod(methodMap)
  BaaS._createRequestMethod = () => {
    let methodMapList = BaaS._config.METHOD_MAP_LIST
    methodMapList.map((v) => {
      utils.doCreateRequestMethod(v)
    })
  }

  // 暴露指定 BaaS 方法
  BaaS.auth = require('./auth')
  BaaS.ContentGroup = require('./ContentGroup')
  BaaS.File = require('./File')
  BaaS.FileCategory = require('./FileCategory')
  BaaS.GeoPoint = require('./GeoPoint')
  BaaS.GeoPolygon = require('./GeoPolygon')
  BaaS.invokeFunction = require('./invokeFunction')
  BaaS.invoke = require('./invokeFunction')
  BaaS.Query = require('./Query')
  BaaS.storage = require('./storage')
  BaaS.TableObject = require('./TableObject')
  BaaS.User = require('./User')
  // 初始化 BaaS 逻辑，添加更多的方法到 BaaS 对象
}
