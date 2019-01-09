const utils = require('core-module/utils')
const constants = require('core-module/constants')
const storage = require('core-module/storage')
const HError = require('core-module/HError')

let isLogining = false
let loginResolve = []
let loginReject = []
let isSilentLogining = false
let silentLoginResolve = []
let silentLoginReject = []

const resolveLoginCallBacks = (userInfo = true) => {
  setTimeout(() => {
    if (userInfo) {
      while (loginResolve.length) {
        loginResolve.shift()(makeLoginResponseData())
      }
    } else {
      while (silentLoginResolve.length) {
        silentLoginResolve.shift()(makeLoginResponseData(false))
      }
    }
  }, 0)
}

const rejectLoginCallBacks = (err, userInfo = true) => {
  setTimeout(() => {
    if (userInfo) {
      while (loginReject.length) {
        loginReject.shift()(err)
      }
    } else {
      while (silentLoginReject.length) {
        silentLoginReject.shift()(err)
      }
    }
  }, 0)
}

const makeLoginResponseData = (userInfo = true) => {  // TODO: 改为 alipay 的返回数据1
  if (userInfo) return Object.assign(
    {[constants.STORAGE_KEY.EXPIRES_AT]: storage.get(constants.STORAGE_KEY.EXPIRES_AT)},
    storage.get(constants.STORAGE_KEY.USERINFO))
  return {
    id: storage.get(constants.STORAGE_KEY.UID),
    openid: storage.get(constants.STORAGE_KEY.OPENID),
    unionid: storage.get(constants.STORAGE_KEY.UNIONID),
    [constants.STORAGE_KEY.EXPIRES_AT]: storage.get(constants.STORAGE_KEY.EXPIRES_AT)
  }
}

/**
 * 通过 force 判断是否为强制登录
 * scope 为 'auth_user'时，是主动授权，会弹出授权窗口
 * scope 为 'auth_base'时，不会弹出授权窗口
 */
const createAuthFn = BaaS => (force = false) => {
  const scope = force ? 'auth_user' : 'auth_base'
  return new Promise((resolve, reject) => {
    my.getAuthCode({
      scopes: scope,
      success: res => {
        if (res.authCode) {
          return sessionInit(BaaS, res.authCode, resolve, reject)
        } else {
          utils.wxRequestFail(reject)  // TODO:
        }
      },
      fail: () => {
        utils.wxRequestFail(reject)  // TODO:
      },
    })
  })
}

// TODO: 缺少 'auth_user' 后端返回用户信息的处理逻辑
const sessionInit = (BaaS, code, resolve, reject) => {
  return BaaS.request({
    url: BaaS._config.API.LOGIN,  // TODO: aliapy login api
    method: 'POST',
    data: {
      code: code
    }
  }).then(res => {
    if (res.statusCode == constants.STATUS_CODE.CREATED) {
      storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      storage.set(constants.STORAGE_KEY.UNIONID, res.data.unionid || '')
      storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + res.data.expires_in - 30)
      resolve(res)
    } else {
      reject(new HError(res.statusCode, utils.extractErrorMsg(res)))
    }
  }, err => {
    reject(err)
  })
}

const createSilentLoginFn = BaaS => () => {
  const auth = createAuthFn(BaaS)
  if (storage.get(constants.STORAGE_KEY.UID) && !utils.isSessionExpired()) {
    return new Promise(resolve => {
      resolve(makeLoginResponseData(false))
    })
  }
  if (isSilentLogining) {
    return new Promise((resolve, reject) => {
      silentLoginResolve.push(resolve)
      silentLoginReject.push(reject)
    })
  }

  isSilentLogining = true
  return new Promise((resolve, reject) => {
    silentLoginResolve.push(resolve)
    silentLoginReject.push(reject)
    auth().then(() => {
      isSilentLogining = false
      resolveLoginCallBacks(false)
    }, err => {
      isSilentLogining = false
      rejectLoginCallBacks(err, false)
    })
  })
}

const createLoginFn = BaaS = (userInfo = true) => {
  const silentLogin = createSilentLoginFn(BaaS)
  if (userInfo) {
    if (storage.get(constants.STORAGE_KEY.USERINFO)) {
      return new Promise(resolve => {
        resolve(makeLoginResponseData())
      })
    }
    if (isLogining) {
      return new Promise((resolve, reject) => {
        loginResolve.push(resolve)
        loginReject.push(reject)
      })
    }
    isLogining = true
    return new Promise((resolve, reject) => {
      loginResolve.push(resolve)
      loginReject.push(reject)
      auth(true).then(() => {
        isLogining = false
        resolveLoginCallBacks()
      }, err => {
        isLogining = false
        rejectLoginCallBacks(err)
      })
    })
  } else {
    return silentLogin()
  }
}

const createLogoutFn = BaaS = () => {
  return new Promise((resolve, reject) => {
    // API.LOGOUT 接口不做 token 检查
    BaaS.request({url: BaaS._config.API.LOGOUT, method: 'POST'}).then(() => {
      BaaS.clearSession()
      resolve()
    }, err => {
      reject(err)
    })
  })
}

module.exports = function (BaaS) {
  BaaS.auth = {
    silentLogin: createSilentLoginFn(BaaS)
  }
  BaaS.login = createLoginFn(BaaS)
  BaaS.logout = createLogoutFn(BaaS)
}
