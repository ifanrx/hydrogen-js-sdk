const constants = require('core-module/constants')
const HError = require('core-module/HError')
const storage = require('core-module/storage')
const utils = require('core-module/utils')
const commonAuth = require('core-module/auth')


module.exports = BaaS => {
  const polyfill = BaaS._polyfill
  const API = BaaS._config.API

  const getLoginCode = () => {
    return new Promise((resolve, reject) => {
      polyfill.wxLogin({
        success: res => {
          resolve(res.code)
        },
        fail: () => {
          BaaS.request.wxRequestFail(reject)
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
      url: API.WECHAT.SILENT_LOGIN,
      method: 'POST',
      data: {
        create_user: createUser,
        code: code
      }
    }).then(utils.validateStatusCode).then(res => {
      BaaS._polyfill.handleLoginSuccess(res)
      resolve(res)
    }, reject)
  }

  /*
   * v2.0.8-a 中存在的 bug:
   * 如果调用 silentLogin（直接调用或在 autoLogin 为 ture 的情况下，401 错误后自动调用），
   * 并且同时调用 loginWithWechat，会发出两个 silent_login 的请求，可能会造成后端同时创建两个用户。
   * 因此，直接在 silentLogin 处做并发限制（loginWithWechat 会调用这个 silentLogin）。
   */
  /**
   * 静默登录
   * @function
   * @memberof BaaS.auth
   */
  const silentLogin = utils.rateLimit(function (...args) {
    if (storage.get(constants.STORAGE_KEY.AUTH_TOKEN) && !utils.isSessionExpired()) {
      return Promise.resolve()
    }
    return auth(...args)
  })

  // 提供给开发者在 button (open-type="getUserInfo") 的回调中调用，对加密数据进行解密，同时将 userinfo 存入 storage 中
  /**
   * 获取用户信息
   * @deprecated
   * @function
   * @memberof BaaS.auth
   * @param {BaaS.handleUserInfoOptions} options 参数
   * @return {Promive<any>}
   */
  const handleUserInfo = res => {
    if (!res || !res.detail) {
      throw new HError(603)
    }

    let detail = res.detail
    let createUser = !!res.createUser
    let syncUserProfile = res.syncUserProfile

    // 用户拒绝授权，仅返回 uid, openid 和 unionid
    // 2019-1-21： 将其封装为 HError 对象，同时输出原有字段
    if (!detail.userInfo) {
      return Promise.reject(Object.assign(new HError(603), {
        id: storage.get(constants.STORAGE_KEY.UID),
        openid: storage.get(constants.STORAGE_KEY.OPENID),
        unionid: storage.get(constants.STORAGE_KEY.UNIONID),
      }))
    }

    return getLoginCode().then(code => {
      return getUserInfo({lang: detail.userInfo.language}).then(detail => {
        let payload = {
          code,
          create_user: createUser,
          rawData: detail.rawData,
          signature: detail.signature,
          encryptedData: detail.encryptedData,
          iv: detail.iv,
          update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
        }

        let userInfo = detail.userInfo
        userInfo.id = storage.get(constants.STORAGE_KEY.UID)
        userInfo.openid = storage.get(constants.STORAGE_KEY.OPENID)
        userInfo.unionid = storage.get(constants.STORAGE_KEY.UNIONID)
        storage.set(constants.STORAGE_KEY.USERINFO, userInfo)
        return getSensitiveData(payload)
      })
    }).then(res => {
      BaaS._polyfill.handleLoginSuccess(res)
    })
  }

  // 上传 signature 和 encryptedData 等信息，用于校验数据的完整性及解密数据，获取 unionid 等敏感数据
  const getSensitiveData = (data) => {
    return BaaS.request({
      url: API.WECHAT.AUTHENTICATE,
      method: 'POST',
      data,
    }).then(utils.validateStatusCode)
  }

  const getUserInfo = ({lang} = {}) => {
    return new Promise((resolve, reject) => {
      BaaS._polyfill.wxGetUserInfo({
        lang,
        success: resolve, fail: reject
      })
    })
  }

  /**
   * 关联微信账号
   * @function
   * @since v2.0.0
   * @memberof BaaS.auth
   * @param {BaaS.AuthData|null} authData 用户信息
   * @param {BaaS.LinkOptions} params 用户信息参数
   */
  const linkWechat = (res, {
    syncUserProfile = constants.UPDATE_USERPROFILE_VALUE.SETNX,
  } = {}) => {
    let refreshUserInfo = false
    if (res && res.detail && res.detail.userInfo) {
      refreshUserInfo = true
    }

    return getLoginCode().then(code => {
      // 如果用户传递了授权信息，则重新获取一次 userInfo, 避免因为重新获取 code 导致 session 失效而解密失败
      let getUserInfoPromise = refreshUserInfo
        ? getUserInfo({lang: res.detail.userInfo.language})
        : Promise.resolve(null)

      return getUserInfoPromise.then(res => {
        let payload = res ? {
          rawData: res.rawData,
          signature: res.signature,
          encryptedData: res.encryptedData,
          iv: res.iv,
          update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
          code
        } : {code}

        return BaaS._baasRequest({
          method: 'POST',
          url: API.WECHAT.USER_ASSOCIATE,
          data: payload
        })
      })
    })
  }


  /**
   * 强制登录
   * @function
   * @since v2.0.0
   * @memberof BaaS.auth
   * @param {BaaS.AuthData|null} authData 用户信息
   * @param {BaaS.LoginOptions} options 其他选项
   * @return {Promise<UserRecord>}
   */
  const loginWithWechat = (authData, {
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

    return loginPromise.then(() => commonAuth.getCurrentUser())
  }

  Object.assign(BaaS.auth, {
    silentLogin,
    loginWithWechat: utils.rateLimit(loginWithWechat),
    handleUserInfo: utils.rateLimit(handleUserInfo),
    linkWechat: utils.rateLimit(linkWechat),
  })


  /*
   * 兼容原有的 API
   */

  /**
   * 微信登录（仅支持静默登录）
   * @deprecated since v2.0.0
   * @function
   * @memberof BaaS
   * @param {boolean} forceLogin 是否是强制登录
   * @return {Promive<any>}
   */
  BaaS.login = function (args) {
    if (args === false) {
      return silentLogin().then(() => ({
        id: storage.get(constants.STORAGE_KEY.UID),
        openid: storage.get(constants.STORAGE_KEY.OPENID),
        unionid: storage.get(constants.STORAGE_KEY.UNIONID),
        [constants.STORAGE_KEY.EXPIRES_AT]: storage.get(constants.STORAGE_KEY.EXPIRES_AT),
      }))
    } else {
      return Promise.reject(new HError(605))
    }
  }

  /**
   * 获取用户信息
   * @deprecated since v2.0.0
   * @function
   * @memberof BaaS
   * @param {BaaS.handleUserInfoOptions} options 参数
   * @return {Promive<any>}
   */
  BaaS.handleUserInfo = function (res) {
    return BaaS.auth.handleUserInfo(res).then(() => commonAuth.getCurrentUser()).then(user => {
      return user.toJSON()
    })
  }

  /**
   * 退出登录状态
   * @deprecated since v2.0.0
   * @function
   * @memberof BaaS
   * @return {Promise<any>}
   */
  BaaS.logout = BaaS.auth.logout
}
