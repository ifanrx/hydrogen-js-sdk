const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const Query = require('./query')
const utils = require('./utils')
const _cloneDeep = require('lodash.cloneDeep')
const _isInteger = require('lodash/isInteger')

const API = BaaS._config.API
const SIMPLE_QUERY = 'simple'
const COMPLEX_QUERY = 'complex'

class TableObject {
  constructor(tableID) {
    this._tableID = tableID
    this._queryObject = {}
    this._queryMode = SIMPLE_QUERY
    this._record = {}
    this._recordID = null
    this._limit = 20
    this._offset = 0
  }

  _resetTableObject() {
    this._queryObject = {}
    this._record = {}
    this._recordID = null
    this._limit = 20,
    this._offset = 0
  }

  _handleQueryObject() {
    let newQueryObject = _cloneDeep(this._queryObject)
    newQueryObject.tableID = this._tableID
    newQueryObject.limit = this._limit
    newQueryObject.offset = this.offset
    return newQueryObject
  }

  create() {
    this._resetTableObject()
    return this
  }

  set(...args) {
    if (args.length === 1) {
      if (typeof args[0] === 'object') {
        this._record = args[0]
      } else {
        throw new Error('只接收参数 (key, value) 或 ({})')
      }
    } else if (args.length === 2) {
      this._record[args[0]] = args[1]
    } else {
      throw new Error('只接收参数 (key, value) 或 ({})')
    }
    return this
  }

  save() {
    var record = _cloneDeep(this.record)
    if (JSON.stringify(this._record) === '{}') {
      throw new Error('set something before save')
    } else {
      this._record = {}
      return BaaS.createRecord({tableID: this.tableID, data: record})
    }
  }

  delete(recordID) {
    return BaaS.deleteRecord({tableID: this.tableID, recordID})
  }

  getWithoutData(recordID) {
    this._recordID = recordID
    return this
  }

  update() {
    var record = _cloneDeep(this.record)
    this._record = {}
    return BaaS.updateRecord({tableID: this.tableID, recordID: this.recordID, data: record})
  }

  get(recordID) {
    return BaaS.getRecord({tableID: this.tableID, recordID})
  }

  setQuery(queryObject) {
    console.log(Object.prototype.toString.call(queryObject))
    if (queryObject instanceof Query) {
      this._queryMode = COMPLEX_QUERY
      this._queryObject = _cloneDeep(queryObject.queryObject)
    } else if (Object.prototype.toString.call(queryObject) === '[object Object]') {
      this._queryMode = SIMPLE_QUERY
      this._queryObject = _cloneDeep(queryObject)
    } else {
      throw new Error('只接收 Query 类型 或 普通对象')
    }
    return this
  }

  limit(amount) {
    if (!amount || !_isInteger(amount)) {
      throw new Error('只接收 Integer 类型')
    }
    this._limit = amount
    return this
  }

  offset(amount) {
    if (!amount || !_isInteger(amount)) {
      throw new Error('只接收 Integer 类型')
    }
    this._offset = amount
    return this
  }

  find() {
    if (this._queryMode === COMPLEX_QUERY) {
      return BaaS.getComplexQueryList(this._handleQueryObject())
    } else {
      return BaaS.getRecordList(this._handleQueryObject())
    }
  }
}

module.exports = TableObject