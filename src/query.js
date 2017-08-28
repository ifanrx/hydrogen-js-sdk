const GeoPoint = require('./geoPoint')
const GeoPolygon = require('./geoPolygon')

class Query {
  constructor() {
    this.queryObject = {}
  }

  static and(...queryObjects) {
    var newQuery = new Query()
    var andQuery = {$and: []}
    queryObjects.forEach(function(query) {
      andQuery['$and'].push(query.queryObject)
    })
    newQuery._setQueryObject(andQuery)
    return newQuery
  }

  static or(...queryObjects) {
    var newQuery = new Query()
    var orQuery = {$or: []}
    queryObjects.forEach(function(query) {
      orQuery['$or'].push(query.queryObject)
    })
    newQuery._setQueryObject(orQuery)
    return newQuery
  }

  compare(key, operator, value) {
    var op = 'eq'
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
        throw new Error('arguments error')
    }
    this._addQueryObject(key, op, value)
    return this
  }

  contains(key, str) {
    this._addQueryObject(key, 'contains', str)
    return this
  }

  in(key, arr) {
    this._addQueryObject(key, 'in', arr)
    return this
  }

  notIn(key, arr) {
    this._addQueryObject(key, 'nin', arr)
    return this
  }

  isNull(key) {
    if (key && key instanceof Array) {
      key.forEach((k) => {
        this._addQueryObject(k, 'isnull', true)
      })
    } else {
      this._addQueryObject(key, 'isnull', true)
    }
    return this
  }

  isNotNull(key) {
    if (key && key instanceof Array) {
      key.forEach((k) => {
        this._addQueryObject(k, 'isnull', false)
      })
    } else {
      this._addQueryObject(key, 'isnull', false)
    }
    return this
  }

  // 在指定多边形集合中找出包含某一点的多边形
  include(key, point) {
    if(point && point instanceof GeoPoint) {
      this._addQueryObject(key, 'intersects', point.toGeoJSON())
      return this
    } else {
      throw Error('参数错误')
    }
  }

  // 在指定点集合中，查找包含于指定的多边形区域的点
  within(key, polygon) {
    if (polygon && polygon instanceof GeoPolygon) {
      this._addQueryObject(key, 'within', polygon.toGeoJSON())
    } else {
      throw Error('参数错误')
    }
  }

  // 在指定点集合中，查找包含在指定圆心和指定半径所构成的圆形区域中的点
  withinCircle(key, point, radius) {
    if (point && point instanceof GeoPoint) {
      var data = {
        radius: radius,
        coordinates: [point.attitude, point.longitude]
      }
      this._addQueryObject(key, 'center', data)
    } else {
      throw Error('参数错误')
    }
  }

  // 在指定点集合中，查找包含在以某点为起点的最大和最小距离所构成的圆环区域中的点
  withinRegion(key, point, minDistance = 0, maxDistance) {
    if (point && point instanceof GeoPoint) {
      var data = {
        geometry: point.toGeoJSON(),
        min_distance: minDistance
      }
      if (maxDistance) {
        data.maxDistance = maxDistance
      }
      this._addQueryObject(key, 'nearsphere', data)
    } else {
      throw Error('参数错误')
    }
  }

  _setQueryObject(queryObject) {
    this.queryObject = queryObject
  }

  _addQueryObject(key, op, value) {
    var query = {[key]: {[`$${op}`]: value}}
    if(!this.queryObject['$and']) {
      this.queryObject['$and'] = []
    }
    this.queryObject['$and'].push(query)
  }
}

module.exports = Query