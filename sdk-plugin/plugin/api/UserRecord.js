const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const utils = require('./utils')

class UserRecord extends BaseRecord {
  constructor(userID) {
    super(userID)
  }

  update() {
    let record = utils.cloneDeep(this._record)
    this._recordValueInit()
    return BaaS.updateUser({data: record.$set})
  }
}

module.exports = UserRecord
