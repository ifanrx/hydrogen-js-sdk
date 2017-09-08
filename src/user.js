
const BaaS = require('./baas')
const constants = require('./constants')
const Promise = require('./promise')
const request = require('./request')
const storage = require('./storage')
const utils = require('./utils')

const API = BaaS._config.API

/**
 * 初始化会话
 * @param  {String} code      wx.login 后返回的 code
 * @param  {Function} resolve Promise resolve function
 * @param  {Function} reject  Promise reject function
 * @return {Promise}
 */
const sessionInit = (code, resolve, reject) => {
  return request({
    url: API.INIT,
    method: 'POST',
    data: {
      code: code
    }
  }).then((res) => {
    if (res.statusCode == constants.STATUS_CODE.CREATED) {
      storage.set(constants.STORAGE_KEY.UID, res.data.user_id)
      storage.set(constants.STORAGE_KEY.OPENID, res.data.openid || '')
      storage.set(constants.STORAGE_KEY.UNIONID, res.data.unionid || '')
      storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token)
      resolve(res)
    } else {
      throw new Error(constants.MSG.CONFIG_ERROR)
    }
  }, (err) => {
    reject(err)
  })
}


/**
 * 验证客户端
 * @return {Promise}
 */
const auth = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        return sessionInit(res.code, resolve, reject)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })

}


let isLogining = false
let loginResolve = []
let loginReject = []

const login = () => {
  if (storage.get(constants.STORAGE_KEY.USERINFO)) {
    return new Promise((resolve, reject) => {
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
    auth().then(() => {
      return getUserInfo().then(() => {
        isLogining = false
        resolveLoginCallBacks()
      }, (err) => {
        isLogining = false
        rejectLoginCallBacks()
      }).catch(() => {
        handleLoginFail()
      })
    }, () => {
      throw new Error(constants.MSG.CONFIG_ERROR)
    }).catch((err) => {
      handleLoginFail(err)
    })
  })
}


let isSilentLogining = false
let silentLoginResolve = []
let silentLoginReject = []

const silentLogin = () => {
  if (storage.get(constants.STORAGE_KEY.UID)) {
    return new Promise((resolve, reject) => {
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
    }, () => {
      isSilentLogining = false
      rejectLoginCallBacks(false)
    }).catch((err) => {
      handleLoginFail(false)
    })
  })
}


const makeLoginResponseData = (userInfo = true) => {
  if (userInfo) return storage.get(constants.STORAGE_KEY.USERINFO)
  return {
    id: storage.get(constants.STORAGE_KEY.UID),
    openid: storage.get(constants.STORAGE_KEY.OPENID),
    unionid: storage.get(constants.STORAGE_KEY.UNIONID)
  }
}

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

const rejectLoginCallBacks = (userInfo = true) => {
  setTimeout(() => {
    if (userInfo) {
      while (loginReject.length) {
        loginReject.shift()(makeLoginResponseData(false))
      }
    } else {
      while (silentLoginReject.length) {
        silentLoginReject.shift()()
      }
    }
  }, 0)
}

const handleLoginFail = (userInfo = true) => {
  if (userInfo) {
    isLogining = false
  } else {
    isSilentLogining = false
  }
  throw new Error(constants.MSG.CONFIG_ERROR)
}


const logout = () => {
  BaaS.check()

  return request({ url: API.LOGOUT, method: 'POST' }).then((res) => {
    if (res.statusCode == constants.STATUS_CODE.CREATED) {
      BaaS.clearSession()
    } else {
      throw new Error(constants.MSG.STATUS_CODE_ERROR)
    }
  }, (err) => {
    throw new Error(err)
  })
}


const getUserInfo = () => {
  if (!BaaS.getAuthToken()) {
    throw new Error('未认证客户端')
  }
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: (res) => {
        let payload = {
          rawData: res.rawData,
          signature: res.signature,
          encryptedData: res.encryptedData,
          iv: res.iv
        }
        let userInfo = res.userInfo
        userInfo.id = storage.get(constants.STORAGE_KEY.UID)
        userInfo.openid = storage.get(constants.STORAGE_KEY.OPENID)
        userInfo.unionid = storage.get(constants.STORAGE_KEY.UNIONID)
        storage.set(constants.STORAGE_KEY.USERINFO, userInfo)
        return authenticate(payload, resolve, reject)
      },
      fail: (err) => {
        // 用户拒绝授权也要继续进入下一步流程
        reject('')
      },
    })
  })
}


/**
 * 登录 BaaS
 * @param  {Object} data    微信签名等信息
 * @param  {Function} resolve Promise resolve function
 * @param  {Function} reject  Promise reject function
 * @return {Promise}
 */
const authenticate = (data, resolve, reject) => {
  return request({
    url: API.LOGIN,
    method: 'POST',
    data: data
  }).then((res) => {
    if (res.statusCode == constants.STATUS_CODE.CREATED) {
      storage.set(constants.STORAGE_KEY.IS_LOGINED_BAAS, '1')
      resolve(res)
    } else {
      reject(constants.MSG.STATUS_CODE_ERROR)
    }
  }, (err) => {
    reject(err)
  })
}


module.exports = {
  auth,
  login,
  silentLogin,
  logout,
}
