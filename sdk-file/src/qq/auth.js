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
      qq.login({
        success: res => {
          resolve(res.code)
        },
        fail: () => {
          BaaS.request.qqRequestFail(reject)
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
      url: API.QQ.SILENT_LOGIN,
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

  const silentLogin = utils.rateLimit(function (...args) {
    if (storage.get(constants.STORAGE_KEY.AUTH_TOKEN) && !utils.isSessionExpired()) {
      return Promise.resolve()
    }
    return auth(...args)
  })

  const getSensitiveData = (data) => {
    return BaaS.request({
      url: API.QQ.AUTHENTICATE,
      method: 'POST',
      data,
    }).then(utils.validateStatusCode)
  }

  const getUserInfo = ({lang} = {}) => {
    return new Promise((resolve, reject) => {
      qq.getUserInfo({
        lang,
        success: resolve, fail: reject
      })
    })
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
      return Promise.reject(Object.assign(new HError(603), {
        id: storage.get(constants.STORAGE_KEY.UID),
        openid: storage.get(constants.STORAGE_KEY.OPENID),
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
        return getSensitiveData(payload)
      })
    }).then(res => {
      BaaS._polyfill.handleLoginSuccess(res)
    })
  }

  /**
   * 关联 QQ 账号
   * @function
   * @since v2.2.0
   * @memberof BaaS.auth
   * @param {BaaS.AuthData|null} authData 用户信息
   * @param {BaaS.LinkOptions} params 用户信息参数
   */
  const linkQQ = (res, {
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
          url: API.QQ.USER_ASSOCIATE,
          data: payload,
        })
      })
    })
  }

  /**
   * QQ 登录
   * @function
   * @since v2.2.0
   * @memberof BaaS.auth
   * @param {BaaS.AuthData|null} authData 用户信息，值为 null 时是静默登录
   * @param {BaaS.LoginOptions} options 其他选项
   * @return {Promise<UserRecord>}
   */
  const loginWithQQ = (authData, {
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
    loginWithQQ: utils.rateLimit(loginWithQQ),
    linkQQ: utils.rateLimit(linkQQ),
  })
}
