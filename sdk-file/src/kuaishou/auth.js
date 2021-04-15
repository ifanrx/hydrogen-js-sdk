const constants = require('core-module/constants')
const HError = require('core-module/HError')
const storageAsync = require('core-module/storageAsync')
const utils = require('core-module/utils')
const commonAuth = require('core-module/auth')

module.exports = BaaS => {
  const API = BaaS._config.API

  // 获取 code
  const getLoginCode = () => {
    return new Promise((resolve, reject) => {
      ks.login({
        success: res => {
          resolve(res.code)
        },
        fail: () => {
          BaaS.request.ksRequestFail(reject)
        },
      })
    })
  }

  // code 换取 session_key，生成并获取 3rd_session 即 token
  const sessionInit = ({code, createUser}, resolve, reject) => {
    return BaaS.request({
      url: API.KUAISHOU.SILENT_LOGIN,
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

  // 获取登录凭证 code, 进而换取用户登录态信息
  const auth = ({createUser = true} = {}) => {
    return new Promise((resolve, reject) => {
      getLoginCode().then(code => {
        sessionInit({code, createUser}, resolve, reject)
      }, reject)
    })
  }

  // 静默登录
  const silentLogin = utils.rateLimit(function (...args) {
    return Promise.all([
      storageAsync.get(constants.STORAGE_KEY.AUTH_TOKEN),
      utils.isSessionExpired(),
    ]).then(([token, expired]) => {
      if (token && !expired) return
      return auth(...args)
    })
  })

  // 弹窗获取用户信息
  const getUserInfo = () => {
    return new Promise((resolve, reject) => {
      ks.getUserInfo({
        withCredentials: true,
        success: resolve, fail: reject,
      })
    })
  }

  // 解密用户信息/手机号
  const getSensitiveData = (data, userInfo) => {
    return BaaS.request({
      url: userInfo ? API.KUAISHOU.AUTHENTICATE : API.KUAISHOU.PHONE_LOGIN,
      method: 'POST',
      data,
    })
      .then(utils.validateStatusCode)
      .then(utils.flatAuthResponse)
  }

  // 提供给开发者在 button (open-type="getUserInfo/getPhoneNumber") 的回调中调用，对加密数据进行解密并登录，同时将 userinfo 存入 storage 中
  const handleUserInfo = res => {
    let detail = res.detail
    let code = res.code
    let createUser = !!res.createUser
    let syncUserProfile = res.syncUserProfile

    // 用户拒绝授权，仅返回 uid, openid
    if (!detail.userInfo && !detail.encryptedData) {
      return Promise.all(([
        storageAsync.get(constants.STORAGE_KEY.UID),
        storageAsync.get(constants.STORAGE_KEY.OPENID),
      ])).then(([id, openid]) => {
        return Promise.reject(Object.assign(new HError(603), {id, openid}))
      })
    }

    let SensitiveData
    if (detail.userInfo) {
      // 用户信息
      SensitiveData = getLoginCode().then(code => {
        return getUserInfo().then(detail => {
          let payload = {
            code,
            create_user: createUser,
            rawData: detail.rawData,
            iv: detail.iv,
            encryptedData: detail.encryptedData,
            signature: detail.signature,
            update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
          }
          return getSensitiveData(payload, detail.userInfo)
        })
      })
    } else {
      // 手机号
      SensitiveData = getSensitiveData({
        code,
        encryptedData: detail.encryptedData || '',
        iv: detail.iv || '',
        create_user: createUser,
      })
    }

    // 登录成功本地存储用户的解密信息
    return SensitiveData.then(res => {
      let userInfo = detail.userInfo ? detail.userInfo : res.data.user_info
      userInfo.id = res.data.user_id
      userInfo.openid = res.data.openid
      BaaS._polyfill.handleLoginSuccess(res, false, userInfo)
      return res
    })
  }

  const linkKs = (res, {
    syncUserProfile = constants.UPDATE_USERPROFILE_VALUE.SETNX,
  } = {}) => {
    let refreshUserInfo = false
    if (res && res.detail && res.detail.userInfo) {
      refreshUserInfo = true
    }

    return getLoginCode().then(code => {
      // 如果用户传递了授权信息，则重新获取一次 userInfo, 避免因为重新获取 code 导致 session 失效而解密失败
      let getUserInfoPromise = refreshUserInfo
        ? getUserInfo()
        : Promise.resolve(null)

      return getUserInfoPromise.then(res => {
        let payload = res ? {
          rawData: res.rawData,
          signature: res.signature,
          encryptedData: res.encryptedData,
          iv: res.iv,
          update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
          code,
        } : {code}

        return BaaS._baasRequest({
          method: 'POST',
          url: API.KUAISHOU.USER_ASSOCIATE,
          data: payload,
        })
      })
    })
  }

  /**
   * 快手登录
   * @function
   * @since v3.16.0
   * @memberof BaaS.auth
   * @param {BaaS.AuthData|null} [authData] 用户信息，值为 null 时是静默登录
   * @param {BaaS.LoginOptions} [options] 其他选项
   * @return {Promise<BaaS.CurrentUser>}
   */
  const loginWithKs = (authData, {
    code = '',
    createUser = true,
    syncUserProfile = constants.UPDATE_USERPROFILE_VALUE.SETNX,
  } = {}) => {
    let loginPromise = null
    if (authData && authData.detail) {
      // 授权用户信息/手机号登录流程
      loginPromise = handleUserInfo({...authData, code, createUser, syncUserProfile})
    } else {
      // 静默登录流程
      loginPromise = silentLogin({createUser})
    }

    return loginPromise.then(res => {
      if (!res) return commonAuth.getCurrentUser()
      return commonAuth._initCurrentUser(res.data.user_info, res.data.expired_at)
    })
  }

  /**
   * 快手更新用户手机号
   * @function
   * @since v2.0.0
   * @member BasS.auth
   * @param {BaaS.authData} [authData] 用户加密手机号信息
   * @param {Baas.overwrite} [overwrite] 默认为 true，如果设置为 false，原本有手机号就会报 400 错误
   * @return {Promise<BaaS.CurrentUser>}
   */
  const updatePhoneNumber = (authData, {
    overwrite = true,
  } = {}) => {
    let data = {
      ...authData,
      overwrite,
    }
    let detail = data.detail

    if (!data || !detail) {
      throw new HError(603)
    }

    // 用户拒绝授权，仅返回 uid, openid
    if (!detail.encryptedData) {
      return Promise.all(([
        storageAsync.get(constants.STORAGE_KEY.UID),
        storageAsync.get(constants.STORAGE_KEY.OPENID),
      ])).then(([id, openid]) => {
        return Promise.reject(Object.assign(new HError(603), {id, openid}))
      })
    }

    let payload = {
      encryptedData: detail.encryptedData,
      iv: detail.iv,
      overwrite,
    }
    return BaaS.request({
      url: API.KUAISHOU.UPDATE_PHONE,
      method: 'PUT',
      data: payload,
    })
      .then(res => {
        if (!res) return commonAuth.getCurrentUser()

        if (res.statusCode === 200) {
          return commonAuth._initCurrentUser(res.data)
        } else if (res.statusCode === 403) {
          // 用户未登录
          return Promise.reject(new HError(604))
        } else {
          // 其他错误
          return Promise.reject(new HError(res.statusCode))
        }
      })
  }

  Object.assign(BaaS.auth, {
    silentLogin,
    loginWithKs: utils.rateLimit(loginWithKs),
    updatePhoneNumber: utils.rateLimit(updatePhoneNumber),
    linkKs: utils.rateLimit(linkKs),
  })
}
