const GeoPoint = require('./GeoPoint')
const GeoPolygon = require('./GeoPolygon')
const HError = require('./HError')
const utils = require('./utils')
const BaseRecord = require('./BaseRecord')

const serializeValue = BaseRecord._serializeValueFuncFactory(['BaseRecord'])

/**
 * @class
 */
class Query {
  constructor() {
    this.queryObject = {}
  }

  static and(...queryObjects) {
    let newQuery = new Query()
    let andQuery = {$and: []}
    queryObjects.forEach(function (query) {
      andQuery['$and'].push(query.queryObject)
    })
    newQuery._setQueryObject(andQuery)
    return newQuery
  }

  static or(...queryObjects) {
    let newQuery = new Query()
    let orQuery = {$or: []}
    queryObjects.forEach(function (query) {
      orQuery['$or'].push(query.queryObject)
    })
    newQuery._setQueryObject(orQuery)
    return newQuery
  }

  /**
   * 比较判断，将 Record[key] 与 value 使用 operator 进行判断，筛选出
   * 符合条件的 Record。
   *
   * @param {string} key - 用于查询判断的字段
   * @param {string} operator - 判断操作符
   * @param {string} value - 用于判断的值
   * @returns {this}
   */
  compare(key, operator, value) {
    let op = 'eq'
    switch(operator) {
    case '=':
      op = 'eq'
      break
    case '!=':
      op = 'ne'
      break
    case '<':
      op = 'lt'
      break
    case '<=':
      op = 'lte'
      break
    case '>':
      op = 'gt'
      break
    case '>=':
      op = 'gte'
      break
    default:
      throw new HError(605)
    }
    this._addQueryObject(key, {[op]: serializeValue(value)})
    return this
  }

  /**
   * 包含判断，筛选出符合条件（Record[key] 包含了字符串 str）的 Record。
   *
   * @param {string} key - 用于查询判断的字段
   * @param {string} str - 用于判断的字符串
   * @returns {this}
   */
  contains(key, str) {
    if (str && utils.isString(str)) {
      this._addQueryObject(key, {contains: str})
      return this
    } else {
      throw new HError(605)
    }
  }

  /**
   * 正则判断，筛选出符合条件（正则表达式 regExp 能匹配 Record[key]）的 Record。
   *
   * @param {string} key - 用于查询判断的字段
   * @param {RegExp} regExp - 正则表达式
   * @returns {this}
   */
  matches(key, regExp) {
    if (regExp && regExp instanceof RegExp) {
      let result = utils.parseRegExp(regExp)

      if (result.length > 1) {
        this._addQueryObject(key, {regex: result[0], options: result[1]})
      } else {
        this._addQueryObject(key, {regex: result[0]})
      }

      return this
    } else {
      throw new HError(605)
    }
  }

  in(key, arr) {
    if (arr && arr instanceof Array) {
      this._addQueryObject(key, {in: arr.map(v => serializeValue(v))})
      return this
    } else {
      throw new HError(605)
    }
  }

  notIn(key, arr) {
    if (arr && arr instanceof Array) {
      this._addQueryObject(key, {nin: arr.map(v => serializeValue(v))})
      return this
    } else {
      throw new HError(605)
    }
  }

  arrayContains(key, arr) {
    if (arr && arr instanceof Array) {
      this._addQueryObject(key, {all: arr})
      return this
    } else {
      throw new HError(605)
    }
  }

  isNull(key) {
    if (key && key instanceof Array) {
      key.forEach((k) => {
        this._addQueryObject(k, {isnull: true})
      })
    } else {
      this._addQueryObject(key, {isnull: true})
    }
    return this
  }

  isNotNull(key) {
    if (key && key instanceof Array) {
      key.forEach((k) => {
        this._addQueryObject(k, {isnull: false})
      })
    } else {
      this._addQueryObject(key, {isnull: false})
    }
    return this
  }

  exists(key) {
    if (key && key instanceof Array) {
      key.forEach((k) => {
        this._addQueryObject(k, {exists: true})
      })
    } else {
      this._addQueryObject(key, {exists: true})
    }
    return this
  }

  notExists(key) {
    if (key && key instanceof Array) {
      key.forEach((k) => {
        this._addQueryObject(k, {exists: false})
      })
    } else {
      this._addQueryObject(key, {exists: false})
    }
    return this
  }

  // 在指定多边形集合中找出包含某一点的多边形
  include(key, point) {
    if (point && point instanceof GeoPoint) {
      this._addQueryObject(key, {intersects: point.toGeoJSON()})
      return this
    } else {
      throw new HError(605)
    }
  }

  // 在指定点集合中，查找包含于指定的多边形区域的点
  within(key, polygon) {
    if (polygon && polygon instanceof GeoPolygon) {
      this._addQueryObject(key, {within: polygon.toGeoJSON()})
      return this
    } else {
      throw new HError(605)
    }
  }

  // 在指定点集合中，查找包含在指定圆心和指定半径所构成的圆形区域中的点
  withinCircle(key, point, radius) {
    if (point && point instanceof GeoPoint) {
      let data = {
        radius: radius,
        coordinates: [point.longitude, point.latitude]
      }
      this._addQueryObject(key, {center: data})
      return this
    } else {
      throw new HError(605)
    }
  }

  // 在指定点集合中，查找包含在以某点为起点的最大和最小距离所构成的圆环区域中的点
  withinRegion(key, point, maxDistance, minDistance = 0) {
    if (point && point instanceof GeoPoint) {
      let data = {
        geometry: point.toGeoJSON(),
        min_distance: minDistance
      }
      if (maxDistance) {
        data.max_distance = maxDistance
      }
      this._addQueryObject(key, {nearsphere: data})
      return this
    } else {
      throw new HError(605)
    }
  }

  hasKey(key, fieldName) {
    if (typeof key !== 'string' || typeof fieldName !== 'string') {
      throw HError(605)
    }

    this._addQueryObject(key, {has_key: fieldName})
    return this
  }

  _setQueryObject(queryObject) {
    this.queryObject = queryObject
  }

  _addQueryObject(key, obj) {
    if (obj.constructor !== Object) {
      throw new HError(605)
    }

    let query = {[key]: {}}

    Object.keys(obj).forEach((k) => {
      query[key][`$${k}`] = obj[k]
    })

    if (!this.queryObject['$and']) {
      this.queryObject['$and'] = []
    }
    this.queryObject['$and'].push(query)
  }
}

module.exports = Query
