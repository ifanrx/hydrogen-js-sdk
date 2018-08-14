const HError = require('./HError')
const GeoPoint = require('./GeoPoint')
const GeoPolygon = require('./GeoPolygon')

class BaseRecord {
  constructor(recordID) {
    this._recordID = recordID
    this._record = {}
  }

  set(...args) {
    if (args.length === 1) {
      if (typeof args[0] === 'object') {
        let objectArg = args[0]
        let record = {}
        Object.keys(args[0]).forEach((key) => {
          record[key] = (objectArg[key] instanceof GeoPoint || objectArg[key] instanceof GeoPolygon) ? objectArg[key].toGeoJSON(): objectArg[key]
        })
        this._record = record
      } else {
        throw new HError(605)
      }
    } else if (args.length === 2) {
      this._record[args[0]] = (args[1] instanceof GeoPoint || args[1] instanceof GeoPolygon) ? args[1].toGeoJSON() : args[1]
    } else {
      throw new HError(605)
    }
    return this
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

  patchObject(key, value) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
      throw new HError(605)
    }

    this._record[key] = {$update: value}
    return this
  }
}

module.exports = BaseRecord