const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const _cloneDeep = require('lodash.clonedeep')

class UserRecord extends BaseRecord {
  constructor() {
    super()
  }

  update() {
    var record = _cloneDeep(this._record)
    this._record = {}
    return BaaS.updateUser({data: record})
  }
}

module.exports = UserRecord