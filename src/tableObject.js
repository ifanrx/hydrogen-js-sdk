const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const constants = require('./constants')
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
        throw new Error(constants.MSG.ARGS_ERROR)
      }
    } else if (args.length === 2) {
      this._record[args[0]] = (args[1] instanceof GeoPoint || args[1] instanceof GeoPolygon) ? args[1].toGeoJSON() : args[1]
    } else {
      throw new Error(constants.MSG.ARGS_ERROR)
    }
    return this
  }

  save() {
    var record = _cloneDeep(this._record)
    this._record = {}
    return BaaS.createRecord({tableID: this._tableID, data: record})
  }

  delete(recordID) {
    return BaaS.deleteRecord({tableID: this._tableID, recordID})
  }

  getWithoutData(recordID) {
    this._recordID = recordID
    return this
  }

  update() {
    var record = _cloneDeep(this._record)
    this._record = {}
    return BaaS.updateRecord({tableID: this._tableID, recordID: this._recordID, data: record})
  }

  get(recordID) {
    return BaaS.getRecord({tableID: this._tableID, recordID})
  }

  incrementBy(key, value) {
    this._record[key] = {$incr_by: value}
    return this
  }

  append(key, value) {
    if (!(value instanceof Array)) {
      value = [value]
    }
    this._record[key] = {$append: value}
    return this
  }

  uAppend(key, value) {
    if (!(value instanceof Array)) {
      value = [value]
    }
    this._record[key] = {$append_unique: value}
    return this
  }

  remove(key, value) {
    if (!(value instanceof Array)) {
      value = [value]
    }
    this._record[key] = {$remove: value}
    return this
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
    if (!value || !_isInteger(value)) {
      throw new Error(constants.MSG.ARGS_ERROR)
    }
    this._limit = value
    return this
  }

  offset(value) {
    if (!value || !_isInteger(value)) {
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