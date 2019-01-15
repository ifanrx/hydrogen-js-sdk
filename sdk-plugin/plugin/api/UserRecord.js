const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const utils = require('./utils')
const USER_PROFILE_BUILD_IN_FIELDS = require('./constants').USER_PROFILE_BUILD_IN_FIELDS
const HError = require('./HError')
const API = BaaS._config.API

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
  updatePassword({password, newPassword, confirmPassword}) {
    return BaaS._baasReuqest({
      url: API.WEB.BASIC_INFO,
      method: 'PUT',
      data: {
        password,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
    }).then(res => {
      return res
    })
  }

  /**
   * 更新邮箱
   * @param email
   * @param sendVerificationEmail
   */
  updateEmail(email, sendVerificationEmail = false) {
    return BaaS._baasReuqest({
      url: API.WEB.BASIC_INFO,
      method: 'PUT',
      data: {email},
    }).then(res => {
      if (sendVerificationEmail) {
        this.requestEmailVerification(email)
      }
      return res
    })
  }

  /**
   * 更新用户名
   * @param username
   * @return {*}
   */
  updateUsername(username) {
    return BaaS._baasReuqest({
      url: API.WEB.BASIC_INFO,
      method: 'PUT',
      data: {username},
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

UserRecord.createCurrentUser = function (userInfo) {
  if (!utils.isObject(userInfo)) {
    return new HError(605)
  }

  let record = new UserRecord()
  record._attribute = userInfo
  record.toJSON = function () {
    return this._attribute
  }

  USER_PROFILE_BUILD_IN_FIELDS.forEach(key => {
    if (userInfo.hasOwnProperty(key)) {
      record[key] = userInfo[key]
    }
  })

  return record
}

module.exports = UserRecord
