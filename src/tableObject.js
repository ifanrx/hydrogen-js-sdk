const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const constants = require('./constants')
const Query = require('./query')
const TableRecord = require('./tableRecord')
const _cloneDeep = require('lodash.clonedeep')
const _isInteger = require('lodash/isInteger')

const API = BaaS._config.API

class TableObject {
  constructor(tableID) {
    this._tableID = tableID
    this._queryObject = {}
    this._limit = 20
    this._offset = 0
    this._orderBy = null
  }

  _handleQueryObject() {
    var conditions = {}
    conditions.tableID = this._tableID
    conditions.limit = this._limit
    conditions.offset = this._offset
    if (this._orderBy) {
      conditions.order_by = this._orderBy
    }
    conditions.where = JSON.stringify(this._queryObject)
    return conditions
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

  setQuery(queryObject) {
    if (queryObject instanceof Query) {
      this._queryObject = _cloneDeep(queryObject.queryObject)
    } else {
      throw new Error(constants.MSG.ARGS_ERROR)
    }
    return this
  }

  limit(value) {
    if (!_isInteger(value)) {
      throw new Error(constants.MSG.ARGS_ERROR)
    }
    this._limit = value
    return this
  }

  offset(value) {
    if (!_isInteger(value)) {
      throw new Error(constants.MSG.ARGS_ERROR)
    }
    this._offset = value
    return this
  }

  orderBy(args) {
    if (args instanceof Array) {
      this._orderBy = args.join(',')
    } else {
      this._orderBy = args
    }
    return this
  }

  find() {
    return BaaS.getRecordList(this._handleQueryObject())
  }
}

module.exports = TableObject