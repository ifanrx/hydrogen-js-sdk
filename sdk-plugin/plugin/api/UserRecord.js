const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const utils = require('./utils')
const USER_PROFILE_BUILD_IN_FIELDS = require('./constants').USER_PROFILE_BUILD_IN_FIELDS
const HError = require('./HError')
const API = BaaS._config.API
const storage = require('./storage')
const constants = require('./constants')

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
   * 将当期用户关联至微信账号
   */
  linkWechat() {
    if (!BaaS._polyfill.linkWechat) {
      return Promise.reject(new HError(605, 'linkWechat 方法未定义'))
    }
    return BaaS._polyfill.linkWechat.apply(null, arguments)
  }

  /**
   * 将当期用户关联至支付宝账号
   */
  linkAlipay() {
    if (!BaaS._polyfill.linkAlipay) {
      return Promise.reject(new HError(605, 'linkAlipay 方法未定义'))
    }
    return BaaS._polyfill.linkAlipay.apply(null, arguments)
  }

  /**
   * 更新密码
   */
  updatePassword({password, newPassword}) {
    return BaaS._baasRequest({
      url: API.WEB.ACCOUNT_INFO,
      method: 'PUT',
      data: {
        password,
        new_password: newPassword,
      },
    }).then(res => {
      return this
    })
  }

  /**
   * 更新邮箱
   * @param email
   * @param password
   * @param sendVerificationEmail
   */
  setEmail({email, newPassword} = {}, {sendVerificationEmail = false} = {}) {
    let payload = {email}

    if (newPassword) {
      payload.new_password = newPassword
    }

    return BaaS._baasRequest({
      url: API.WEB.ACCOUNT_INFO,
      method: 'PUT',
      data: payload,
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
  setUsername({username, newPassword} = {}) {
    let payload = {
      username
    }

    if (newPassword) {
      payload.new_password = newPassword
    }

    return BaaS._baasRequest({
      url: API.WEB.ACCOUNT_INFO,
      method: 'PUT',
      data: payload,
    }).then(res => {
      Object.assign(this._attribute, res.data)
      return this
    })
  }


  /**
   * 发送验证邮件
   */
  requestEmailVerification() {
    return BaaS._baasRequest({
      url: API.WEB.EMAIL_VERIFY,
      method: 'POST',
    })
  }


  /**
   * 更改手机号
   * @param mobile
   * @param sendVerificationSMSCode
   */
  updateMobile(mobile, sendVerificationSMSCode = false) {
    if (sendVerificationSMSCode) {
      this.requestMobileVerification(mobile)
    }
    // TODO：本期先不做
  }

  /**
   * 发送手机号验证
   * @param mobile
   */
  requestMobileVerification() {
    // TODO：本期先不做
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
  record._attribute = userInfo
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
