const constants = require('../constants')
const HError = require('../HError')
const storage = require('../storage')
const utils = require('../utils')

let loginResolve = []
let loginReject = []
let isSilentLogining = false
let silentLoginResolve = []
let silentLoginReject = []

module.exports = BaaS => {
  const polyfill = BaaS._polyfill
  const API = BaaS._config.API

  // 获取登录凭证 code, 进而换取用户登录态信息
  const auth = () => {
    return new Promise((resolve, reject) => {
      polyfill.wxLogin({
        success: res => {
          return sessionInit(res.code, resolve, reject)
        },
        fail: () => {
          BaaS.request.wxRequestFail(reject)
        },
      })
    })
  }

  // code 换取 session_key，生成并获取 3rd_session 即 token
  const sessionInit = (code, resolve, reject) => {
    return BaaS.request({
      url: API.LOGIN,
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

  const silentLogin = () => {
    if (storage.get(constants.STORAGE_KEY.AUTH_TOKEN) && !utils.isSessionExpired()) {
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

  const makeLoginResponseData = (userInfo = true) => {
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

  // 提供给开发者在 button (open-type="getUserInfo") 的回调中调用，对加密数据进行解密，同时将 userinfo 存入 storage 中
  const handleUserInfo = (res) => {
    if (!res || !res.detail) {
      throw new HError(603)
    }

    let detail = res.detail

    return new Promise((resolve, reject) => {
      return silentLogin().then(() => {
        // 用户拒绝授权，仅返回 uid, openid 和 unionid
        if (!detail.userInfo) {
          return reject(makeLoginResponseData(false))
        }

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

        return getSensitiveData(payload, resolve, reject, userInfo)
      }, (err) => {
        reject(err)
      })
    })
  }

  // 上传 signature 和 encryptedData 等信息，用于校验数据的完整性及解密数据，获取 unionid 等敏感数据
  const getSensitiveData = (data, resolve, reject, userInfo) => {
    return BaaS.request({
      url: API.AUTHENTICATE,
      method: 'POST',
      data: data
    }).then(res => {
      storage.set(constants.STORAGE_KEY.IS_LOGINED_BAAS, '1')
      if (!userInfo.unionid && res.data.unionid) {
        userInfo.unionid = res.data.unionid
        storage.set(constants.STORAGE_KEY.UNIONID, userInfo.unionid)
      }
      storage.set(constants.STORAGE_KEY.USERINFO, userInfo)
      resolve(makeLoginResponseData())
    }, err => {
      reject(err)
    })
  }

  BaaS.auth.handleUserInfo = handleUserInfo
  BaaS.auth.loginWithWechat = BaaS.auth.silentLogin = silentLogin
}