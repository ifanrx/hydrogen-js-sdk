const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const UserRecord = require('./UserRecord')
const utils = require('./utils')
const HError = require('./HError')

/**
 * @class User
 */
class User extends BaseQuery {
  constructor() {
    super()
  }

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

  getWithoutData(userID) {
    if (utils.isString(userID) || Number.isInteger(userID)) {
      return new UserRecord(userID)
    } else {
      throw new HError(605)
    }
  }

  getCurrentUserWithoutData() {
    return new UserRecord()
  }

  find() {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.getUserList(condition)
  }
}

module.exports = User
