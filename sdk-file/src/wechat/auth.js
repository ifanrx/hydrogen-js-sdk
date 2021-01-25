const constants = require('core-module/constants')
const HError = require('core-module/HError')
const storageAsync = require('core-module/storageAsync')
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
  const auth = ({createUser = true, withUnionID = false} = {}) => {
    return new Promise((resolve, reject) => {
      getLoginCode().then(code => {
        sessionInit({code, createUser, withUnionID}, resolve, reject)
      }, reject)
    })
  }

  // code 换取 session_key，生成并获取 3rd_session 即 token
  const sessionInit = ({code, createUser, withUnionID}, resolve, reject) => {
    return BaaS.request({
      url: API.WECHAT.SILENT_LOGIN,
      method: 'POST',
      data: {
        create_user: createUser,
        code: code,
        login_with_unionid: withUnionID,
      }
    })
      .then(utils.validateStatusCode)
      .then(utils.flatAuthResponse)
      .then(res => {
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
   * @deprecated since v2.0.0
   * @memberof BaaS.auth
   */
  const silentLogin = utils.rateLimit(function (...args) {
    return Promise.all([
      storageAsync.get(constants.STORAGE_KEY.AUTH_TOKEN),
      utils.isSessionExpired(),
    ]).then(([token, expired]) => {
      if (token && !expired) return
      return auth(...args)
    })
  })

  // 提供给开发者在 button (open-type="getUserInfo") 的回调中调用，对加密数据进行解密，同时将 userinfo 存入 storage 中
  /**
   * 获取用户信息、手机号
   * @function
   * @memberof BaaS.auth
   * @param {BaaS.handleUserInfoOptions} options 参数
   * @return {Promise<any>}
   */
  const handleUserInfo = (res) => {
    if (!res || !res.detail) {
      throw new HError(603)
    }

    let detail = res.detail
    let createUser = !!res.createUser
    let syncUserProfile = res.syncUserProfile
    let withUnionID = res.withUnionID
    let loginCode = res.code

    // 用户拒绝授权，仅返回 uid, openid 和 unionid
    // 2019-1-21： 将其封装为 HError 对象，同时输出原有字段
    if (!detail.userInfo && !detail.encryptedData) {
      return Promise.all(([
        storageAsync.get(constants.STORAGE_KEY.UID),
        storageAsync.get(constants.STORAGE_KEY.OPENID),
        storageAsync.get(constants.STORAGE_KEY.UNIONID),
      ])).then(([id, openid, unionid]) => {
        return Promise.reject(Object.assign(new HError(603), {id, openid, unionid}))
      })
    }

    let SensitiveData
    let payload = {
      encryptedData: detail.encryptedData || '',
      iv: detail.iv || '',
      create_user: createUser,
    }
    if (detail.userInfo) {
      SensitiveData = getLoginCode().then(code => {
        // 用户信息
        return getUserInfo({lang: detail.userInfo.language}).then(detail => {
          return getSensitiveData({
            ...payload,
            code: code,
            rawData: detail.rawData,
            signature: detail.signature,
            login_with_unionid: withUnionID,
            update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
          },detail.userInfo)
        })
      })
    } else {
      // 手机号
      SensitiveData = getSensitiveData({
        ...payload,
        code: loginCode
      })
    }

    return SensitiveData.then(res => {
      let userInfo = detail.userInfo ? detail.userInfo : res.data.user_info
      userInfo.id = res.data.user_id
      userInfo.openid = res.data.openid
      userInfo.unionid = res.data.unionid
      BaaS._polyfill.handleLoginSuccess(res, false, userInfo)
      return res
    })
  }

  // 上传 signature 和 encryptedData 等信息，用于校验数据的完整性及解密数据，获取 unionid 等敏感数据
  const getSensitiveData = (data,userInfo) => {
    return BaaS.request({
      url: userInfo ? API.WECHAT.AUTHENTICATE : API.WECHAT.PHONE_LOGIN,
      method: 'POST',
      data,
    })
      .then(utils.validateStatusCode)
      .then(utils.flatAuthResponse)
  }

  const getUserInfo = ({lang} = {}) => {
    return new Promise((resolve, reject) => {
      BaaS._polyfill.wxGetUserInfo({
        lang,
        success: resolve, fail: reject
      })
    })
  }

  const linkWechat = (res, {
    syncUserProfile = constants.UPDATE_USERPROFILE_VALUE.SETNX,
    withUnionID = false,
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
          associate_with_unionid: withUnionID,
          code,
        } : {
          code,
          associate_with_unionid: withUnionID,
        }

        return BaaS._baasRequest({
          method: 'POST',
          url: API.WECHAT.USER_ASSOCIATE,
          data: payload
        })
      })
    })
  }


  /**
   * 微信登录
   * @function
   * @since v2.0.0
   * @memberof BaaS.auth
   * @param {BaaS.AuthData|null} [authData] 用户信息，值为 null 时是静默登录
   * @param {BaaS.WechatLoginOptions} [options] 其他选项
   * @return {Promise<BaaS.CurrentUser>}
   */
  const loginWithWechat = (authData, {
    code = '',
    createUser = true,
    withUnionID = false,
    syncUserProfile = constants.UPDATE_USERPROFILE_VALUE.SETNX,
  } = {}) => {
    let loginPromise = null
    if (authData && authData.detail) {
      // 授权用户信息/手机号登录流程
      loginPromise = handleUserInfo({...authData, code, createUser, syncUserProfile, withUnionID})
    } else {
      // 静默登录流程
      loginPromise = silentLogin({createUser, withUnionID})
    }
    return loginPromise.then((res) => {
      if (!res) return commonAuth.getCurrentUser()
      return commonAuth._initCurrentUser(res.data.user_info, res.data.expired_at)
    })
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
   * @return {Promise<any>}
   */
  BaaS.login = function (args) {
    if (args === false) {
      return silentLogin().then(() => {
        return Promise.all([
          storageAsync.get(constants.STORAGE_KEY.UID),
          storageAsync.get(constants.STORAGE_KEY.OPENID),
          storageAsync.get(constants.STORAGE_KEY.UNIONID),
          storageAsync.get(constants.STORAGE_KEY.EXPIRES_AT),
        ]).then(([id, openid, unionid, expiredAt]) => {
          return {
            id,
            openid,
            unionid,
            [constants.STORAGE_KEY.EXPIRES_AT]: expiredAt,
          }
        })
      })
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
   * @return {Promise<any>}
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
