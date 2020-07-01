const constants = require('./constants')
const storage = require('./storage')
const storageAsync = require('./storageAsync')
const HError = require('./HError')
const utils = require('./utils')

module.exports = function (BaaS) {
  /**
   * SDK 初始化
   *
   * @function init
   * @memberof BaaS
   * @param {string} clientID - 知晓云应用的 client id
   * @param {BaaS.InitOptions} [options] - 其他选项
   */
  BaaS.init = (clientID, {
    autoLogin = false,
    logLevel = '',
    host = '',
    ws_host,
    env
  } = {}) => {
    if (!utils.isString(clientID)) {
      throw new HError(605)
    }
    if (logLevel) {
      utils.setLogLevel(logLevel)
    }
    if (ws_host) {
      BaaS._config.WS_HOST = ws_host
    }
    BaaS._config.AUTO_LOGIN = autoLogin
    BaaS._config.ENV = env
    BaaS._config.CLIENT_ID = clientID
    BaaS._config.API_HOST = host
    BaaS._config.LOG_LEVEL = logLevel
    BaaS._polyfill.checkLatestVersion()
  }

  /**
   * 获取 token
   *
   * @memberof BaaS
   * @return {string}
   */
  BaaS.getAuthToken = () => {
    return storageAsync.get(constants.STORAGE_KEY.AUTH_TOKEN)
  }

  /**
   * SDK 版本检查
   *
   * @memberof BaaS
   * @param {BaaS.CheckVersionOptions} options
   */
  BaaS.checkVersion = ({platform, onSuccess, onError} = {}) => {
    if (!onSuccess) {
      onSuccess = res => {
        let statusCode = res.statusCode || res.status
        if (parseInt(statusCode) !== constants.STATUS_CODE.SUCCESS) {
          onError && onError(res)
        } else {
          let result = utils.compareVersion(BaaS._config.VERSION, res.data[platform])
          if (result === -1) {
            utils.log(constants.LOG_LEVEL.WARN,
              `【知晓云 SDK 更新提示】当前 SDK 版本为 ${BaaS._config.VERSION} 最新版本为 ${res.data[platform]}，请前往 ${BaaS._config.SDK_DOWNLOAD_PAGE} 下载。`)
          }
        }
      }
    }

    let now = Date.now()
    return storageAsync.get(constants.STORAGE_KEY.LATEST_VERSION_CHECK_MILLISECONDS).then(lastCheckMilliseconds => {
      if (lastCheckMilliseconds && lastCheckMilliseconds - now <= constants.VERSION_MIN_CHECK_INTERVAL) {
        return
      }
      storageAsync.set(constants.STORAGE_KEY.LATEST_VERSION_CHECK_MILLISECONDS, now)
      return BaaS.request({url: BaaS._config.API.LATEST_VERSION}).then(onSuccess, onError)
    })
  }

  /**
   * 清除会话（退出登录）
   *
   * @memberof BaaS
   */
  BaaS.clearSession = () => {
    return Promise.all([
      // 清除客户端认证 Token
      storageAsync.set(constants.STORAGE_KEY.AUTH_TOKEN, ''),
      // 清除 BaaS 登录状态
      storageAsync.set(constants.STORAGE_KEY.IS_LOGINED_BAAS, ''),
      storageAsync.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, ''),
      // 清除用户信息
      storageAsync.set(constants.STORAGE_KEY.USERINFO, ''),
      storageAsync.set(constants.STORAGE_KEY.UID, ''),
    ])
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
  BaaS.storage = storage
  BaaS.storageAsync = storageAsync
  BaaS.TableObject = require('./TableObject')
  BaaS.User = require('./User')
  BaaS.Order = require('./Order')
  BaaS.getAsyncJobResult = require('./getAsyncJobResult')
  BaaS.getServerDate = require('./getServerDate')
  // 初始化 BaaS 逻辑，添加更多的方法到 BaaS 对象
}
