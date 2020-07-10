const constants = require('core-module/constants')
const storageAsync = require('core-module/storageAsync')
const utils = require('core-module/utils')
const commonAuth = require('core-module/auth')

const appName = utils.getBytedanceAppName()

module.exports = BaaS => {
  const API = BaaS._config.API

  const getLoginCode = () => {
    return new Promise((resolve, reject) => {
      tt.login({
        force: true,
        success: res => {
          resolve(res.code)
        },
        fail: () => {
          BaaS.request.ttRequestFail(reject)
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
      url: API.BYTEDANCE.SILENT_LOGIN,
      method: 'POST',
      data: {
        create_user: createUser,
        app_name: appName,
        code: code
      }
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
    ]).then(res => {
      const [token, isExpired] = res
      if (token && !isExpired) {
        return Promise.resolve()
      }
      return auth(...args)
    })
  })

  const getSensitiveData = (data) => {
    return BaaS.request({
      url: API.BYTEDANCE.AUTHENTICATE,
      method: 'POST',
      data,
    })
      .then(utils.validateStatusCode)
      .then(utils.flatAuthResponse)
  }

  const getUserInfo = options => {
    return new Promise((resolve, reject) => {
      tt.getUserInfo(Object.assign(options, {
        success: resolve, fail: reject
      }))
    })
  }

  const forceLogin = ({createUser, syncUserProfile} = {}) => {
    let detail
    return getLoginCode().then(code => {
      return getUserInfo({withCredentials: true}).then(res => {
        detail = res
        let payload = {
          code,
          app_name: appName,
          create_user: createUser,
          rawData: res.rawData,
          signature: res.signature,
          encryptedData: res.encryptedData,
          iv: res.iv,
          update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
        }
        return getSensitiveData(payload)
      })
    }).then(res => {
      let userInfo = detail.userInfo
      userInfo.id = res.data.user_id
      userInfo.openid = res.data.openid
      BaaS._polyfill.handleLoginSuccess(res, false, userInfo)
      return res
    })
  }


  const linkTt = ({
    forceLogin: isForceLogin = false,
    syncUserProfile = constants.UPDATE_USERPROFILE_VALUE.SETNX,
  } = {}) => {
    return getLoginCode().then(code => {
      // 如果用户传递了授权信息，则重新获取一次 userInfo, 避免因为重新获取 code 导致 session 失效而解密失败
      let getUserInfoPromise = isForceLogin
        ? getUserInfo({withCredentials: true})
        : Promise.resolve(null)

      return getUserInfoPromise.then(res => {
        let payload = res ? {
          rawData: res.rawData,
          signature: res.signature,
          encryptedData: res.encryptedData,
          iv: res.iv,
          update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
          app_name: appName,
          code
        } : {
          code,
          app_name: appName,
        }

        return BaaS._baasRequest({
          method: 'POST',
          url: API.BYTEDANCE.USER_ASSOCIATE,
          data: payload,
        })
      })
    })
  }

  /**
   * 头条登录
   * @function
   * @since v2.5.0
   * @memberof BaaS.auth
   * @param {BaaS.BytedanceLoginOptions} [options] 其他选项
   * @return {Promise<BaaS.CurrentUser>}
   */
  const loginWithTt = ({
    forceLogin: isForceLogin = false,
    createUser = true,
    syncUserProfile = constants.UPDATE_USERPROFILE_VALUE.SETNX,
  } = {}) => {
    let loginPromise = null
    if (isForceLogin) {
      loginPromise = forceLogin({createUser, syncUserProfile})
    } else {
      // 静默登录流程
      loginPromise = silentLogin({createUser})
    }

    return loginPromise.then((res) => commonAuth._initCurrentUser(res.data.user_info, res.data.expired_at))
  }

  Object.assign(BaaS.auth, {
    silentLogin,
    loginWithTt: utils.rateLimit(loginWithTt),
    linkTt: utils.rateLimit(linkTt),
  })
}
