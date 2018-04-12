const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const UserRecord = require('./UserRecord')

class User extends BaseQuery {
  constructor() {
    super()
  }

  get(userID) {
    return BaaS.getUserDetail({userID})
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