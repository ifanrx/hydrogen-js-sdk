const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const TableRecord = require('./TableRecord')

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
    let params = {tableID: this._tableID, recordID}
    if (this._expand) {
      params.expand = this._expand
    }
    return BaaS.getRecord(params)
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