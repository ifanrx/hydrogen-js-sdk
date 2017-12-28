const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const baasRequest = require('./baasRequest').baasRequest
const UserRecord = require('./UserRecord')

class User extends BaseQuery {
  constructor() {
    super()
  }

  get(id) {
    return BaaS.getUserDetail({id})
  }

  getWithoutData(id) {
    return new UserRecord(id)
  }

  find() {
    return BaaS.getUserList(this._handleAllQueryConditions())
  }
}

module.exports = User