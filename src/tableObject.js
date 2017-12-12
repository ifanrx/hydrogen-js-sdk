const BaaS = require('./baas')
const BaseQuery = require('./baseQuery')
const TableRecord = require('./tableRecord')

class TableObject extends BaseQuery {
  constructor(tableID) {
    super()
    this._tableID = tableID
  }

  create() {
    return new TableRecord(this._tableID)
  }

  delete(recordID) {
    return BaaS.deleteRecord({tableID: this._tableID, recordID})
  }

  getWithoutData(recordID) {
    return new TableRecord(this._tableID, recordID)
  }

  get(recordID) {
    return BaaS.getRecord({tableID: this._tableID, recordID})
  }

  _handleAllQueryConditions() {
    let condition = super._handleAllQueryConditions()
    condition.tableID = this._tableID
    return condition
  }

  find() {
    return BaaS.queryRecordList(this._handleAllQueryConditions())
  }
}

module.exports = TableObject