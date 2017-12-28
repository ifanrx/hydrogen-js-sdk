const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const baasRequest = require('./baasRequest').baasRequest
const UserRecord = require('./UserRecord')

class User extends BaseQuery {
  constructor() {
    super()
    this.userID = null
  }

  get(userID) {
    return BaaS.getUserDetail({userID})
  }

  getWithoutData(userID) {
    return new UserRecord(userID)
  }

  find() {
    return BaaS.getUserList(this._handleAllQueryConditions())
  }
}

module.exports = User