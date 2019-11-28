const UserRecord = require('./UserRecord')
const BaaS = require('./baas')
const HError = require('./HError')
const utils = require('./utils')
const constants = require('./constants')
const USER_PROFILE_BUILD_IN_FIELDS = constants.USER_PROFILE_BUILD_IN_FIELDS
const API = BaaS._config.API

/**
 * @memberof BaaS
 * @extends BaaS.UserRecord
 * @package
 */
class CurrentUser extends UserRecord {
  /**
   * @param {Object} attribute 用户信息
   */
  constructor(attribute) {
    super()
    if (!utils.isObject(attribute)) {
      return new HError(605)
    }
    this._attribute = Object.assign({}, attribute)
    Object.keys(attribute).forEach(key => {
      // 以下划线开头或者是原有内置字段将直接添加在该对象上
      if (key[0] === '_' || USER_PROFILE_BUILD_IN_FIELDS.includes(key)) {
        this[key] = attribute[key]
      }
    })
  }

  /**
   * 修改 account 信息（username、email、phone）后，后端返回的数据（{ username: '***', phone: '***', email: '***' }）
   * 与 getCurrentUser 返回的数据（{ _username: '***', _phone: '***', _email: '***' }）在字段名上有差异，所以需要做一下处理。
   *
   * @private
   */
  _mergeAccountInfo(info) {
    Object.keys(info).forEach(key => {
      this._attribute[`_${key}`] = info[key]
    })
  }

  /**
   * 以 JSON Object 的形式返回用户信息
   * @returns {Object} 用户信息
   */
  toJSON() {
    return this._attribute
  }

  /**
   * 获取某一项用户信息
   * @param {string} key 用户信息 key
   * @returns {any} 用户信息
   */
  get(key) {
    return this._attribute[key]
  }

  /**
   * 将微信账号绑定到当前用户，匿名用户无法调用
   * @param {BaaS.AuthData|null} [authData] 用户信息
   * @param {BaaS.LinkOptions} [params] 用户信息参数
   * @returns {Promise<this>} UserRecord 实例
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
   * 将支付宝账号绑定到当前用户，匿名用户无法调用
   * @param {BaaS.LinkAlipayParams} [options] 参数
   * @returns {Promise<this>} UserRecord 实例
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
   * 将 QQ 账号绑定到当前用户，匿名用户无法调用
   * @param {BaaS.AuthData|null} [authData] 用户信息
   * @param {BaaS.LinkOptions} [params] 用户信息参数
   * @returns {Promise<this>} UserRecord 实例
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
   * 将百度账号绑定到当前用户，匿名用户无法调用
   * @param {BaaS.AuthData|null} [authData] 用户信息
   * @param {BaaS.LinkOptions} [params] 用户信息参数
   * @returns {Promise<this>} [UserRecord] 实例
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

  /**
   * 将第三方账号绑定到当前用户，匿名用户无法调用
   * @since v2.1.0
   * @param {string} providor 第三方平台
   * @param {string} authPageUrl 授权页面 URL
   * @param {BaaS.LinkThirdPartyParams} [options] 其他选项
   * @returns {Promise<this>} UserRecord 实例
   */
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
   *
   * @param {BaaS.UpdatePasswordParams} options
   * @returns {Promise<this>} UserRecord 实例
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
   * @param {string|null} email email 地址
   * @param {SetEmailOptions} [options] 可选参数
   * @returns {Promise<this>} UserRecord 实例
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
      this._mergeAccountInfo(res.data)
      return this
    })
  }

  /**
   * 更新用户名
   * @param {string|null} username 用户名
   * @returns {Promise<this>} UserRecord 实例
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
      this._mergeAccountInfo(res.data)
      return this
    })
  }

  /**
   * 发送验证邮件
   * @returns {Promise<this>} UserRecord 实例
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
   * @param {BaaS.SetAccountParmas} accountInfo
   * @returns {Promise<this>} UserRecord 实例
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
      this._mergeAccountInfo(res.data)
      return this
    })
  }


  /**
   * 更改手机号
   * @param {string|null} phone 手机号码
   * @returns {Promise<this>} UserRecord 实例
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
      this._mergeAccountInfo(res.data)
      return this
    })
  }

  /**
   * 验证手机号
   * @param {string} code 短信验证码
   * @returns {Promise<this>} UserRecord 实例
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

module.exports = CurrentUser
