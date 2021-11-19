const constants = require('core-module/constants')
const HError = require('core-module/HError')
const storageAsync = require('core-module/storageAsync')
const utils = require('core-module/utils')
const commonAuth = require('core-module/auth')

module.exports = BaaS => {
  const API = BaaS._config.API

  const getLoginCode = () => {
    return new Promise((resolve, reject) => {
      swan.getLoginCode({
        success: res => {
          resolve(res.code)
        },
        fail: () => {
          BaaS.request.swanRequestFail(reject)
        },
      })
    })
  }

  // 获取登录凭证 code, 进而换取用户登录态信息
  const auth = ({createUser = true} = {}) => {
    return new Promise((resolve, reject) => {
      getLoginCode().then(code => {
        sessionInit({code, createUser}, resolve, reject)
      }, reject)
    })
  }

  // code 换取 session_key，生成并获取 3rd_session 即 token
  const sessionInit = ({code, createUser}, resolve, reject) => {
    return BaaS.request({
      url: API.BAIDU.SILENT_LOGIN,
      method: 'POST',
      data: {
        create_user: createUser,
        code: code,
      },
    })
      .then(utils.validateStatusCode)
      .then(utils.flatAuthResponse)
      .then(res => {
        BaaS._polyfill.handleLoginSuccess(res)
        resolve(res)
      }, reject)
  }

  const silentLogin = utils.rateLimit(function (...args) {
    return Promise.all([
      storageAsync.get(constants.STORAGE_KEY.AUTH_TOKEN),
      utils.isSessionExpired(),
    ]).then(([token, expired]) => {
      if (token && !expired) return
      return auth(...args)
    })
  })

  const getSensitiveData = data => {
    return BaaS.request({
      url: API.BAIDU.AUTHENTICATE,
      method: 'POST',
      data,
    })
      .then(utils.validateStatusCode)
      .then(utils.flatAuthResponse)
  }

  // 提供给开发者在 button (open-type="getUserInfo") 的回调中调用，对加密数据进行解密，同时将 userinfo 存入 storage 中
  const handleUserInfo = res => {
    if (!res || !res.detail) {
      throw new HError(603)
    }

    let detail = res.detail
    let createUser = !!res.createUser
    let syncUserProfile = res.syncUserProfile

    // 用户拒绝授权，仅返回 uid, openid
    if (!detail.userInfo) {
      return Promise.all(([
        storageAsync.get(constants.STORAGE_KEY.UID),
        storageAsync.get(constants.STORAGE_KEY.OPENID),
      ])).then(([id, openid]) => {
        return Promise.reject(Object.assign(new HError(603), {id, openid}))
      })
    }

    return getLoginCode().then(code => {
      let payload = {
        code,
        create_user: createUser,
        data: detail.encryptedData,
        iv: detail.iv,
        update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
      }
      return getSensitiveData(payload)
    }).then(res => {
      let userInfo = detail.userInfo
      userInfo.id = res.data.user_id
      userInfo.openid = res.data.openid
      userInfo.unionid = res.data.unionid
      BaaS._polyfill.handleLoginSuccess(res, false, userInfo)
      return res
    })
  }

  const linkBaidu = () => {
    return getLoginCode().then(code => {
      let payload = {code}

      return BaaS._baasRequest({
        method: 'POST',
        url: API.BAIDU.USER_ASSOCIATE,
        data: payload,
      })
    })
  }

  /**
   * 百度登录
   * @function
   * @since v2.5.0
   * @memberof BaaS.auth
   * @param {BaaS.AuthData|null} [authData] 用户信息，值为 null 时是静默登录
   * @param {BaaS.LoginOptions} [options] 其他选项
   * @return {Promise<BaaS.CurrentUser>}
   */
  const loginWithBaidu = (authData, {
    createUser = true,
    syncUserProfile = constants.UPDATE_USERPROFILE_VALUE.SETNX,
  } = {}) => {
    let loginPromise = null
    if (authData && authData.detail) {
      // handleUserInfo 流程
      loginPromise = handleUserInfo(Object.assign(authData, {createUser, syncUserProfile}))
    } else {
      // 静默登录流程
      loginPromise = silentLogin({createUser})
    }

    return loginPromise.then(res => {
      if (!res) return commonAuth.getCurrentUser()
      return commonAuth._initCurrentUser(res.data.user_info, res.data.expired_at)
    })
  }

  Object.assign(BaaS.auth, {
    silentLogin,
    loginWithBaidu: utils.rateLimit(loginWithBaidu),
    linkBaidu: utils.rateLimit(linkBaidu),
  })
}
