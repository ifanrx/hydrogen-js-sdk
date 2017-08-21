const GeoPoint = require('./geoPoint')
const _cloneDeep = require('lodash.clonedeep')

class GeoPolygon {
  constructor(args) {
    if (args && args instanceof Array) {
      if (args.length < 3) {
        throw Error('point less than three')
      } else {
        this.points = args
        this.geoJSON = {
          type: 'Polygon',
          coordinates: []
        }
      }
    } else {
      throw Error('只接收参数 [GeoPoint] 或 [[], [], ...]')
    }
  }

  toGeoJSON() {
    var coordinates = this.geoJSON.coordinates
    this.points.forEach((point) => {
      if(point instanceof GeoPoint) {
        coordinates.push([point.attitude, point.longitude])
      } else if (point instanceof Array && point.length === 2) {
        coordinates.push(point)
      } else {
        throw Error('point is invaild')
      }
    })
    return _cloneDeep(this.geoJSON)
  }
}

module.exports = GeoPolygon