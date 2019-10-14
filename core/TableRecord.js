const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const utils = require('./utils')

class TableRecord extends BaseRecord {
  constructor(tableID, recordID, queryObject = {}) {
    super(recordID)
    this._tableID = tableID
    this._queryObject = queryObject
  }

  save() {
    let record = utils.cloneDeep(this._record)
    this._recordValueInit()
    return BaaS.createRecord({tableID: this._tableID, data: record.$set})
  }

  update({enableTrigger = false} = {}) {
    let record = utils.cloneDeep(this._record)
    this._recordValueInit()
    if (this._recordID) {
      return BaaS.updateRecord({tableID: this._tableID, recordID: this._recordID, data: record})
    } else {
      const params = {
        tableID: this._tableID,
        data: record,
        where: JSON.stringify(this._queryObject.where),
        limit: utils.getLimitationWithEnableTigger(this._queryObject.limit, enableTrigger),
        offset: this._queryObject.offset,
        enable_trigger: enableTrigger ? 1 : 0
      }
      this._queryObject = {}
      return BaaS.updateRecordList(params)
    }
  }
}

module.exports = TableRecord
