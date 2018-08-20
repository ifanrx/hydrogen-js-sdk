const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const utils = require('./utils')

class TableRecord  extends BaseRecord {
  constructor(tableID, recordID, queryObject = {}) {
    super(recordID)
    this._tableID = tableID
    this._queryObject = queryObject
  }

  save() {
    let record = utils.cloneDeep(this._record)
    this._record = {}
    return BaaS.createRecord({tableID: this._tableID, data: record})
  }

  update() {
    let record = utils.cloneDeep(this._record)
    this._record = {}
    if (this._recordID) {
      return BaaS.updateRecord({tableID: this._tableID, recordID: this._recordID, data: record})
    } else {
      const params = {
        tableID: this._tableID,
        data: record,
        where: JSON.stringify(this._queryObject.where),
        limit: this._queryObject.limit,
        offset: this._queryObject.offset
      }
      this._queryObject = {}
      return BaaS.updateRecordList(params)
    }
  }
}

module.exports = TableRecord