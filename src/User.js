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
    return BaaS.getUserList(this._handleAllQueryConditions())
  }
}

module.exports = User