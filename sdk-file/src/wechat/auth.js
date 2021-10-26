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
      },
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

  // 提供给开发者在 button (open-type="getPhoneNumber") 的回调中调用，对加密数据进行解密，同时将 userinfo 存入 storage 中
  /**
   * 获取用户信息、手机号
   * @function
   * @memberof BaaS.auth
   * @param {BaaS.handleUserInfoOptions} options 参数
   * @return {Promise<any>}
   */
  const handleUserInfo = res => {
    if (!res || !res.detail) {
      throw new HError(603)
    }

    const {detail: {encryptedData, iv}, code, createUser} = res

    // 用户拒绝授权，仅返回 uid, openid 和 unionid
    // 2019-1-21： 将其封装为 HError 对象，同时输出原有字段
    if (!encryptedData) {
      return Promise.all(([
        storageAsync.get(constants.STORAGE_KEY.UID),
        storageAsync.get(constants.STORAGE_KEY.OPENID),
        storageAsync.get(constants.STORAGE_KEY.UNIONID),
      ])).then(([id, openid, unionid]) => {
        return Promise.reject(Object.assign(new HError(603), {id, openid, unionid}))
      })
    }

    return getSensitiveData({
      encryptedData,
      iv,
      create_user: !!createUser,
      code,
    }).then(res => {
      const {user_info: userInfo, user_id: id, openid, unionid} = res.data
      BaaS._polyfill.handleLoginSuccess(res, false, {...userInfo, id, openid, unionid})
      return res
    })
  }

  // 上传 iv 和 encryptedData 等信息，用于校验数据的完整性及解密数据，获取 unionid 等敏感数据
  const getSensitiveData = data => {
    return BaaS.request({
      url: API.WECHAT.PHONE_LOGIN,
      method: 'POST',
      data,
    })
      .then(utils.validateStatusCode)
      .then(utils.flatAuthResponse)
  }

  const linkWechat = ({withUnionID = false} = {}) => {
    return getLoginCode().then(code => {
      return BaaS._baasRequest({
        method: 'POST',
        url: API.WECHAT.USER_ASSOCIATE,
        data: {
          code,
          associate_with_unionid: withUnionID,
        },
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
  } = {}) => {
    let loginPromise = null
    if (authData && authData.detail) {
      // 手机号登录流程
      loginPromise = handleUserInfo({...authData, code, createUser})
    } else {
      // 静默登录流程
      loginPromise = silentLogin({createUser, withUnionID})
    }
    return loginPromise.then(res => {
      if (!res) return commonAuth.getCurrentUser()
      return commonAuth._initCurrentUser(res.data.user_info, res.data.expired_at)
    })
  }

  /**
   * 更新用户信息
   * @function
   * @since v3.17.0
   * @memberof BaaS.auth
   * @param {BaaS.AuthData} authData 用户信息
   * @param {BaaS.UpdateUserInfoOptions} [options] 其他选项
   * @return {Promise<BaaS.CurrentUser>}
   */
  const updateUserInfo = (authData, {
    code = '',
    syncUserProfile = constants.UPDATE_USERPROFILE_VALUE.SETNX,
  } = {}) => {
    if (!authData || !authData.userInfo) {
      return Promise.reject(new HError(603))
    }

    /**
     * 由于微信在基础库 2.16.0 及以上将 rawData/signature/encryptedData/iv 移回了 wx.getUserProfile 的返回中，
     * 因此接口需要升级，但还需保留旧接口，因为要兼容基础库（2.10.4 <= 基础库 < 2.16.0）版本
     */
    const version = polyfill.getSystemInfoSync().SDKVersion
    const isBaseLibraryNewer = utils.compareBaseLibraryVersion(version, '2.16.0') >= 0

    if (isBaseLibraryNewer && !code) {
      return Promise.reject(new HError(605))
    }

    const data = isBaseLibraryNewer ? {
      rawData: authData.rawData,
      encryptedData: authData.encryptedData,
      signature: authData.signature,
      iv: authData.iv,
      code,
      update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
    } : {
      ...authData.userInfo,
      update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
    }

    return BaaS.request({
      url: isBaseLibraryNewer ? API.WECHAT.UPDATE_USER_INFO_UPGRADED : API.WECHAT.UPDATE_USER_INFO,
      method: 'PUT',
      data,
    })
      .then(res => {
        if (!res) return commonAuth.getCurrentUser()
        switch (res.statusCode) {
        case 200:
          return commonAuth._initCurrentUser(res.data)
        case 401:
          // 用户未登录
          return Promise.reject(new HError(604))
        case 403:
          // 未开启 JSSDK 修改平台用户信息开关
          return Promise.reject(new HError(616))
        default:
          // 其他错误
          return Promise.reject(new HError(res.statusCode))
        }
      })
  }

  /**
   * 更新用户手机号
   * @function
   * @since v2.0.0
   * @memberof BaaS.auth
   * @param {BaaS.AuthData} [authData] 用户加密手机号信息
   * @param {BaaS.UpdatePhoneNumberOptions} [overwrite] 默认为 true，如果设置为 false，原本有手机号就会报 400 错误
   * @return {Promise<BaaS.CurrentUser>}
   */
  const updatePhoneNumber = (authData, {
    overwrite = true,
  } = {}) => {
    let data = {
      ...authData,
      overwrite,
    }

    if (!data || !data.detail) {
      throw new HError(603)
    }

    // 用户拒绝授权，仅返回 uid, openid 和 unionid
    // 2019-1-21： 将其封装为 HError 对象，同时输出原有字段
    if (!authData.detail.encryptedData) {
      return Promise.all(([
        storageAsync.get(constants.STORAGE_KEY.UID),
        storageAsync.get(constants.STORAGE_KEY.OPENID),
        storageAsync.get(constants.STORAGE_KEY.UNIONID),
      ])).then(([id, openid, unionid]) => {
        return Promise.reject(Object.assign(new HError(603), {id, openid, unionid}))
      })
    }

    let payload = {
      encryptedData: authData.detail.encryptedData,
      iv: authData.detail.iv,
      overwrite,
    }
    return BaaS.request({
      url: API.WECHAT.UPDATE_PHONE,
      method: 'PUT',
      data: payload,
    })
      .then(res => {
        if (!res) return commonAuth.getCurrentUser()

        if (res.statusCode === 200) {
          return commonAuth._initCurrentUser(res.data)
        } else if (res.statusCode === 401) {
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
    loginWithWechat: utils.rateLimit(loginWithWechat),
    handleUserInfo: utils.rateLimit(handleUserInfo),
    updateUserInfo: utils.rateLimit(updateUserInfo),
    updatePhoneNumber: utils.rateLimit(updatePhoneNumber),
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
