const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const _cloneDeep = require('lodash.clonedeep')

class TableRecord  extends BaseRecord {
  constructor(tableID, recordID) {
    super(recordID)
    this._tableID = tableID
  }

  save() {
    var record = _cloneDeep(this._record)
    this._record = {}
    return BaaS.createRecord({tableID: this._tableID, data: record})
  }

  update() {
    var record = _cloneDeep(this._record)
    this._record = {}
    return BaaS.updateRecord({tableID: this._tableID, recordID: this._recordID, data: record})
  }
}

module.exports = TableRecord