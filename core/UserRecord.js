const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const utils = require('./utils')
const constants = require('./constants')
const USER_PROFILE_BUILD_IN_FIELDS = constants.USER_PROFILE_BUILD_IN_FIELDS
const HError = require('./HError')
const API = BaaS._config.API

/**
 * @class UserRecord
 */
class UserRecord extends BaseRecord {
  constructor(userID) {
    super(userID)
  }

  update() {
    let record = utils.cloneDeep(this._record)
    this._recordValueInit()
    return BaaS.updateUser({data: record.$set})
  }

  /**
   * 将当前用户关联至微信账号
   */
  linkWechat() {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    if (!BaaS._polyfill.linkWechat) {
      return Promise.reject(new HError(605, 'linkWechat 方法未定义'))
    }
    return BaaS._polyfill.linkWechat.apply(null, arguments)
  }

  /**
   * 将当前用户关联至支付宝账号
   */
  linkAlipay() {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    if (!BaaS._polyfill.linkAlipay) {
      return Promise.reject(new HError(605, 'linkAlipay 方法未定义'))
    }
    return BaaS._polyfill.linkAlipay.apply(null, arguments)
  }

  /**
   * 将当前用户关联至 QQ 账号
   */
  linkQQ() {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    if (!BaaS._polyfill.linkQQ) {
      return Promise.reject(new HError(605, 'linkQQ 方法未定义'))
    }
    return BaaS._polyfill.linkQQ.apply(null, arguments)
  }

  /**
   * 将当前用户关联至百度账号
   */
  linkBaidu() {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    if (!BaaS._polyfill.linkBaidu) {
      return Promise.reject(new HError(605, 'linkBaidu 方法未定义'))
    }
    return BaaS._polyfill.linkBaidu.apply(null, arguments)
  }

  linkThirdParty() {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    if (!BaaS._polyfill.linkThirdParty) {
      return Promise.reject(new HError(605, 'linkThirdParty 方法未定义'))
    }
    return BaaS._polyfill.linkThirdParty.apply(null, arguments)
  }

  /**
   * 更新密码
   */
  updatePassword({password, newPassword}) {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    return BaaS._baasRequest({
      url: API.ACCOUNT_INFO,
      method: 'PUT',
      data: {
        password,
        new_password: newPassword,
      },
    }).then(() => this)
  }

  /**
   * 更新邮箱
   * @param email
   * @param sendVerificationEmail
   */
  setEmail(email, {sendVerificationEmail = false} = {}) {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    return BaaS._baasRequest({
      url: API.ACCOUNT_INFO,
      method: 'PUT',
      data: {email},
    }).then(res => {
      if (sendVerificationEmail) {
        this.requestEmailVerification(email)
      }
      Object.assign(this._attribute, res.data)
      return this
    })
  }

  /**
   * 更新用户名
   * @param username
   * @return {*}
   */
  setUsername(username) {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    return BaaS._baasRequest({
      url: API.ACCOUNT_INFO,
      method: 'PUT',
      data: {username},
    }).then(res => {
      Object.assign(this._attribute, res.data)
      return this
    })
  }

  /**
   * 发送验证邮件
   */
  requestEmailVerification() {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    return BaaS._baasRequest({
      url: API.EMAIL_VERIFY,
      method: 'POST',
    }).then(() => this)
  }

  /**
   * 初次设置账号信息
   * @param {object}  accountInfo
   */
  setAccount(accountInfo = {}) {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    if (accountInfo.password) {
      accountInfo.new_password = accountInfo.password
      delete accountInfo.password
    }

    return BaaS._baasRequest({
      url: API.ACCOUNT_INFO,
      method: 'PUT',
      data: accountInfo,
    }).then(res => {
      Object.assign(this._attribute, res.data)
      return this
    })
  }


  /**
   * 更改手机号
   * @param mobile
   */
  setMobilePhone(phone) {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    return BaaS._baasRequest({
      url: API.ACCOUNT_INFO,
      method: 'PUT',
      data: {phone},
    }).then(res => {
      Object.assign(this._attribute, res.data)
      return this
    })
  }

  /**
   * 验证手机号
   * @param code 短信验证码
   */
  verifyMobilePhone(code) {
    if (this._anonymous) {
      return Promise.reject(new HError(612))
    }
    return BaaS._baasRequest({
      url: API.VERIFY_MOBILE,
      method: 'POST',
      data: {code},
    }).then(() => this)
  }
}

/**
 * 创建一个 currentUser 对象
 * @param userInfo
 */
UserRecord.initCurrentUser = function (userInfo) {
  if (!utils.isObject(userInfo)) {
    return new HError(605)
  }

  let record = new UserRecord()
  record._attribute = Object.assign({}, userInfo)
  record.toJSON = function () {
    return this._attribute
  }

  record.get = function (key) {
    return this._attribute[key]
  }

  Object.keys(userInfo).forEach(key => {
    // 以下划线开头或者是原有内置字段将直接添加在该对象上
    if (key[0] === '_' || USER_PROFILE_BUILD_IN_FIELDS.includes(key)) {
      record[key] = userInfo[key]
    }
  })

  return record
}

module.exports = UserRecord
