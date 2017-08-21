const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const GeoPoint = require('./geoPoint')
const GeoPolygon = require('./geoPolygon')
const Query = require('./query')
const utils = require('./utils')
const _cloneDeep = require('lodash.clonedeep')
const _isInteger = require('lodash/isInteger')

const API = BaaS._config.API

class TableObject {
  constructor(tableID) {
    this._tableID = tableID
    this._queryObject = {}
    this._record = {}
    this._recordID = null
    this._limit = 20
    this._offset = 0
    this._orderBy = null
  }

  _resetTableObject() {
    this._queryObject = {}
    this._record = {}
    this._recordID = null
    this._limit = 20,
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
    this._resetTableObject()
    return this
  }

  set(...args) {
    if (args.length === 1) {
      if (typeof args[0] === 'object') {
        var objectArg = args[0]
        var record = {}
        Object.keys(args[0]).forEach((key) => {
          record[key] = (objectArg[key] instanceof GeoPoint || objectArg[key] instanceof GeoPolygon) ? objectArg[key].toGeoJSON(): objectArg[key]
        })
        this._record = record
      } else {
        throw new Error('只接收参数 (key, value) 或 ({})')
      }
    } else if (args.length === 2) {
      this._record[args[0]] = (args[1] instanceof GeoPoint || args[1] instanceof GeoPolygon) ? args[1].toGeoJSON() : args[1]
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
    if (queryObject instanceof Query) {
      this._queryObject = _cloneDeep(queryObject.queryObject)
    } else {
      throw new Error('只接收 Query 类型')
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

  orderBy(args) {
    if (args instanceof Array) {
      this._orderBy = args.join(',')
    } else {
      this._orderBy = args
    }
    return this
  }

  find() {
    return BaaS.RECORD_LIST(this._handleQueryObject())
  }
}

module.exports = TableObject