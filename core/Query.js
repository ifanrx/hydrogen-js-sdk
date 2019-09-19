const GeoPoint = require('./GeoPoint')
const GeoPolygon = require('./GeoPolygon')
const HError = require('./HError')
const utils = require('./utils')
const BaseRecord = require('./BaseRecord')

const serializeValue = BaseRecord._serializeValueFuncFactory(['BaseRecord'])

/**
 * @memberof BaaS
 * @instance
 */
class Query {
  constructor() {
    this.queryObject = {}
  }

  /**
   * and 操作符。将多个 Query 对象使用 and 操作符进行合并
   *
   * @static
   * @function
   * @param {...Query} querys Query 对象
   * @returns {Query} - 新的 Query 对象
   */
  static and(...queryObjects) {
    let newQuery = new Query()
    let andQuery = {$and: []}
    queryObjects.forEach(function (query) {
      andQuery['$and'].push(query.queryObject)
    })
    newQuery._setQueryObject(andQuery)
    return newQuery
  }

  /**
   * or 操作符。将多个 Query 对象使用 or 操作符进行合并
   *
   * @static
   * @function
   * @param {...Query} querys Query 对象
   * @returns {Query} - 新的 Query 对象
   */
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
   * @returns {this} Query 实例
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
   * @returns {this} Query 实例
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
   * @returns {this} Query 实例
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

  /**
   * 包含判断，筛选出符合条件（数组 arr 包含 Record[key]）的 Record。
   *
   * @param {string} key - 用于查询判断的字段
   * @param {Array<any>} arr - 用于判断的数组
   * @returns {this} Query 实例
   */
  in(key, arr) {
    if (arr && arr instanceof Array) {
      this._addQueryObject(key, {in: arr.map(v => serializeValue(v))})
      return this
    } else {
      throw new HError(605)
    }
  }

  /**
   * 不包含判断，筛选出符合条件（数组 arr 不包含 Record[key]）的 Record。
   *
   * @param {string} key - 用于查询判断的字段
   * @param {Array<any>} arr - 用于判断的数组
   * @returns {this} Query 实例
   */
  notIn(key, arr) {
    if (arr && arr instanceof Array) {
      this._addQueryObject(key, {nin: arr.map(v => serializeValue(v))})
      return this
    } else {
      throw new HError(605)
    }
  }

  /**
   * 数组包含判断。
   * 判断逻辑：Record[key] 是数组类型，且包含 arr 数组中的元素
   *
   * @param {string} key - 用于查询判断的字段
   * @param {Array<any>} arr - 用于判断的数组
   * @returns {this} Query 实例
   */
  arrayContains(key, arr) {
    if (arr && arr instanceof Array) {
      this._addQueryObject(key, {all: arr})
      return this
    } else {
      throw new HError(605)
    }
  }

  /**
   * 为 Null 判断。
   * 判断逻辑：Record[key] 是 null
   *
   * @param {string} key - 用于查询判断的字段
   * @returns {this} Query 实例
   */
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

  /**
   * 不为 Null 判断。
   * 判断逻辑：Record[key] 不是 null
   *
   * @param {string} key - 用于查询判断的字段
   * @returns {this} Query 实例
   */
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

  /**
   * 存在判断。
   * 判断逻辑：Record[key] 不是 undefined
   *
   * @param {string} key - 用于查询判断的字段
   * @returns {this} Query 实例
   */
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

  /**
   * 不存在判断。
   * 判断逻辑：Record[key] 是 undefined
   *
   * @param {string} key - 用于查询判断的字段
   * @returns {this} Query 实例
   */
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

  /**
   * 多边形包含判断，在指定多边形集合中找出包含某一点的多边形（geojson 类型）。
   * 判断逻辑：Record[key] 包含 point
   *
   * @param {string} key - 用于查询判断的字段
   * @param {GeoPoint} point - 点
   * @returns {this} Query 实例
   */
  include(key, point) {
    if (point && point instanceof GeoPoint) {
      this._addQueryObject(key, {intersects: point.toGeoJSON()})
      return this
    } else {
      throw new HError(605)
    }
  }

  /**
   * 多边形包含判断，在指定点集合中，查找包含于指定的多边形区域的点（geojson 类型）。
   * 判断逻辑：polygon 包含 Record[key]
   *
   * @param {string} key - 用于查询判断的字段
   * @param {GeoPolygon} polygon - 多边形
   * @returns {this} Query 实例
   */
  within(key, polygon) {
    if (polygon && polygon instanceof GeoPolygon) {
      this._addQueryObject(key, {within: polygon.toGeoJSON()})
      return this
    } else {
      throw new HError(605)
    }
  }

  /**
   * 圆包含判断，在指定点集合中，查找包含在指定圆心和指定半径所构成的圆形区域中的点（geojson 类型）。
   * 判断逻辑：以 point 为圆心、以 redius 为半径的圆包含 Record[key]
   *
   * @param {string} key - 用于查询判断的字段
   * @param {GeoPoint} point - 圆心
   * @param {number} radius - 半径
   * @returns {this} Query 实例
   */
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

  /**
   * 圆环包含判断，在指定点集合中，查找包含在以某点为起点的最大和最小距离所构成的圆环区域中的点（geojson 类型）。
   * 判断逻辑：以 point 为圆心、以 minDistance 最小半径、以 maxDistance 为最大半径的圆环包含 Record[key]
   *
   * @param {string} key - 用于查询判断的字段
   * @param {GeoPoint} point - 圆心
   * @param {number} maxDistance - 最大半径
   * @param {number} [minDistance] - 最小半径
   * @returns {this} Query 实例
   */
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

  /**
   * 存在字段判断。
   * 判断逻辑：Record[key] 为 Object 类型，且 Record[key][fieldName] 不为 undefined
   *
   * @param {string} key - 用于查询判断的字段
   * @param {string} fieldName - 字段名称
   * @returns {this} Query 实例
   */
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
