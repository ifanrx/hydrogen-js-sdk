const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const UserRecord = require('./UserRecord')
const utils = require('./utils')
const HError = require('./HError')

/**
 * 用户
 * @memberof BaaS
 * @extends BaaS.BaseQuery
 * @public
 */
class User extends BaseQuery {
  constructor() {
    super()
  }

  /**
   * 获取用户详情。
   * @method
   * @param {string} userID 用户 ID
   * @return {Promise<Response<any>>}
   */
  get(userID) {
    let params = {userID}
    if (this._expand) {
      params.expand = this._expand
    }

    if (this._keys) {
      params.keys = this._keys
    }
    this._initQueryParams()
    return BaaS.getUserDetail(params)
  }

  /**
   * 获取一个用户记录（仅引用，非数据）。
   * @param {string} userID 用户 ID
   * @return {BaaS.UserRecord}
   */
  getWithoutData(userID) {
    if (utils.isString(userID) || Number.isInteger(userID)) {
      return new UserRecord(userID)
    } else {
      throw new HError(605)
    }
  }

  /**
   * 获取当前用户记录（仅引用，非数据）。
   * @returns {BaaS.UserRecord}
   */
  getCurrentUserWithoutData() {
    return new UserRecord()
  }

  /**
   * 获取用户列表。
   * @method
   * @param {BaaS.FindOptions} [options] 参数
   * @return {Promise<Response<any>>}
   */
  find({withCount = false} = {}) {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.getUserList(Object.assign({}, condition, {
      return_total_count: withCount ? 1 : 0,
    }))
  }

  /**
   * 获取用户数量。
   * @method
   * @since v3.0.0
   * @return {Promise<number>}
   */
  count() {
    return this.limit(1).find({withCount: true}).then(res => {
      let {total_count} = res.data.meta
      return total_count
    })
  }
}

module.exports = User
