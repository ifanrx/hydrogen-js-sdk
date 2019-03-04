const constants = require('../constants')
const HError = require('../HError')
const storage = require('../storage')
const utils = require('../utils')
const commonAuth = require('../auth')

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
      storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      storage.set(constants.STORAGE_KEY.UNIONID, res.data.unionid || '')
      storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      storage.set(constants.STORAGE_KEY.USERINFO, {
        id: res.data.user_id,
        openid: res.data.openid,
        unionid: res.data.unionid,
      })
      storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
      resolve(res)
    }, reject)
  }

  const silentLogin = function (...args) {
    if (storage.get(constants.STORAGE_KEY.AUTH_TOKEN) && !utils.isSessionExpired()) {
      return Promise.resolve()
    }
    return auth(...args)
  }

  // 提供给开发者在 button (open-type="getUserInfo") 的回调中调用，对加密数据进行解密，同时将 userinfo 存入 storage 中
  const handleUserInfo = res => {
    if (!res || !res.detail) {
      throw new HError(603)
    }

    let detail = res.detail
    let createUser = !!res.createUser

    // 用户拒绝授权，仅返回 uid, openid 和 unionid
    // 2019-1-21： 将其封装为 HError 对象，同时输出原有字段
    if (!detail.userInfo) {
      return Promise.reject(Object.assign(new HError(603), {
        id: storage.get(constants.STORAGE_KEY.UID),
        openid: storage.get(constants.STORAGE_KEY.OPENID),
        unionid: storage.get(constants.STORAGE_KEY.UNIONID),
      }))
    }

    return silentLogin({createUser}).then(() => {
      return getUserInfo().then(detail => {
        let payload = {
          rawData: detail.rawData,
          signature: detail.signature,
          encryptedData: detail.encryptedData,
          iv: detail.iv
        }

        let userInfo = detail.userInfo
        userInfo.id = storage.get(constants.STORAGE_KEY.UID)
        userInfo.openid = storage.get(constants.STORAGE_KEY.OPENID)
        userInfo.unionid = storage.get(constants.STORAGE_KEY.UNIONID)
        storage.set(constants.STORAGE_KEY.USERINFO, userInfo)
        return getSensitiveData(payload, userInfo)
      })
    })
  }

  // 上传 signature 和 encryptedData 等信息，用于校验数据的完整性及解密数据，获取 unionid 等敏感数据
  const getSensitiveData = (data, userInfo) => {
    return BaaS.request({
      url: API.WECHAT.AUTHENTICATE,
      method: 'POST',
      data: data
    }).then(utils.validateStatusCode).then(res => {
      if (!userInfo.unionid && res.data.unionid) {
        userInfo.unionid = res.data.unionid
        storage.set(constants.STORAGE_KEY.UNIONID, userInfo.unionid)
      }
    })
  }

  const getUserInfo = () => {
    return new Promise((resolve, reject) => {
      BaaS._polyfill.wxGetUserInfo({
        success: resolve, fail: reject
      })
    })
  }

  const linkWechat = res => {
    let refreshUserInfo = false
    if (res && res.userInfo) {
      refreshUserInfo = true
    }

    return getLoginCode().then(code => {
      // 如果用户传递了授权信息，则重新获取一次 userInfo, 避免因为重新获取 code 导致 session 失效而解密失败
      let getUserInfoPromise = refreshUserInfo ? getUserInfo() : Promise.resolve(null)

      return getUserInfoPromise.then(res => {
        let payload = res ? {
          rawData: res.rawData,
          signature: res.signature,
          encryptedData: res.encryptedData,
          iv: res.iv,
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

  const loginWithWechat = (authData, opts = {}) => {
    let loginPromise = null
    // handleUserInfo 流程
    if (authData && authData.detail) {
      loginPromise = handleUserInfo(Object.assign(authData, {createUser: opts.createUser}))
    } else {
      // 静默登录流程
      loginPromise = silentLogin(opts)
    }

    return loginPromise.then(() => commonAuth.getCurrentUser())
  }

  Object.assign(BaaS.auth, {
    silentLogin: utils.rateLimit(silentLogin),
    loginWithWechat: utils.rateLimit(loginWithWechat),
    handleUserInfo: utils.rateLimit(handleUserInfo),
    linkWechat: utils.rateLimit(linkWechat),
  })


  // 兼容原有的 API

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

  BaaS.handleUserInfo = function (res) {
    return BaaS.auth.handleUserInfo(res).then(() => commonAuth.getCurrentUser()).then(user => {
      return user.toJSON()
    })
  }

  BaaS.logout = BaaS.auth.logout
}