
const BaaS = require('./baas')
const constants = require('./constants')
const Promise = require('./promise')
const request = require('./request')
const storage = require('./storage')
const utils = require('./utils')

const API = BaaS._config.API

let isLogining = false
let loginResolve = []
let loginReject = []
let isSilentLogining = false
let silentLoginResolve = []
let silentLoginReject = []


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
      reject(new Error(constants.MSG.CONFIG_ERROR))
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

const login = (userInfo = true) => {
  if (!userInfo) return silentLogin()

  return new Promise((resolve, reject) => {
    if (storage.get(constants.STORAGE_KEY.USERINFO)) {
      return resolve({isAuth: true, data: makeLoginResponseData(true)})
    }

    loginResolve.push(resolve)
    loginReject.push(reject)

    if (!isLogining) {
      isLogining = true

      silentLogin().then(() => {
        return getUserInfo().then((res) => {
          isLogining = false
          resolveLoginCallBacks(res, true)
        })
      }).catch((err) => {
        isLogining = false
        rejectLoginCallBacks(err, true)
      })
    }
  })
}

const silentLogin = () => {
  return new Promise((resolve, reject) => {
    if (storage.get(constants.STORAGE_KEY.UID)) {
      return resolve({data: makeLoginResponseData(false)})
    }

    silentLoginResolve.push(resolve)
    silentLoginReject.push(reject)

    if (!isSilentLogining) {
      isSilentLogining = true

      return auth().then(() => {
        isSilentLogining = false
        resolveLoginCallBacks({data: makeLoginResponseData(false)}, false)
      }, (err) => {
        isSilentLogining = false
        rejectLoginCallBacks(err, false)
      })
    }
  })
}

const makeLoginResponseData = (userInfo = true) => {
  if (userInfo) {
    return storage.get(constants.STORAGE_KEY.USERINFO)
  }
  return {
    id: storage.get(constants.STORAGE_KEY.UID),
    openid: storage.get(constants.STORAGE_KEY.OPENID),
    unionid: storage.get(constants.STORAGE_KEY.UNIONID)
  }
}


const resolveLoginCallBacks = (data, userInfo) => {
  if (userInfo) {
    setTimeout(() => {
      while (loginResolve.length) {
        loginResolve.shift()(data)
      }
    }, 0)
  } else {
    setTimeout(() => {
      while (silentLoginResolve.length) {
        silentLoginResolve.shift()(data)
      }
    }, 0)
  }
}

const rejectLoginCallBacks = (err, userInfo) => {
  if (userInfo) {
    setTimeout(() => {
      while (loginReject.length) {
        loginReject.shift()(err)
      }
    }, 0)
  } else {
    setTimeout(() => {
      while (silentLoginReject.length) {
        silentLoginReject.shift()(err)
      }
    }, 0)
  }
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
        resolve({isAuth: false, data: makeLoginResponseData(false)})
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
      resolve({isAuth: true, data: makeLoginResponseData(true)})
    } else {
      reject(new Error(constants.MSG.STATUS_CODE_ERROR))
    }
  })
}


module.exports = {
  auth,
  login,
  logout,
}