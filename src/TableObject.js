const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const Query = require('./Query')
const TableRecord = require('./TableRecord')
const _isString = require('lodash/isString')
const _isNumber = require('lodash/isNumber')
const _isArray = require('lodash/isArray')
const _cloneDeep = require('lodash.clonedeep')
const HError = require('./HError')

class TableObject extends BaseQuery {
  constructor(tableID) {
    super()
    this._tableID = tableID
  }

  create() {
    return new TableRecord(this._tableID)
  }

  createMany(args) {
    if (_isArray(args)) {
      const params = {
        tableID: this._tableID,
        data: args
      }
      return BaaS.createRecordList(params)
    } else {
      throw new HError(605)
    }
  }

  delete(args) {
    if (_isString(args) || _isNumber(args)) {
      return BaaS.deleteRecord({tableID: this._tableID, recordID: args})
    } else if (args instanceof Query) {
      const params = {
        tableID: this._tableID,
        limit: this._limit,
        offset: this._offset,
        where: JSON.stringify(args.queryObject)
      }
      this._initQueryParams()
      return BaaS.deleteRecordList(params)
    } else {
      throw new HError(605)
    }
  }

  getWithoutData(args) {
    if (_isString(args) || _isNumber(args)) {
      return new TableRecord(this._tableID, args)
    } else if (args instanceof Query) {
      let queryObject = {}
      queryObject.limit = this._limit
      queryObject.offset = this._offset
      queryObject.where = _cloneDeep(args.queryObject)
      this._initQueryParams()
      return new TableRecord(this._tableID, null, queryObject)
    } else {
      throw new HError(605)
    }
  }

  get(recordID) {
    let params = {tableID: this._tableID, recordID}

    if (this._expand) {
      params.expand = this._expand
    }

    if (this._keys) {
      params.keys = this._keys
    }

    this._initQueryParams()

    return BaaS.getRecord(params)
  }

  _handleAllQueryConditions() {
    let condition = super._handleAllQueryConditions()
    condition.tableID = this._tableID
    return condition
  }

  find() {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.queryRecordList(condition)
  }
}

module.exports = TableObject
