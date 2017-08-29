const GeoPoint = require('./geoPoint')
const _cloneDeep = require('lodash.clonedeep')

class GeoPolygon {
  constructor(args) {
    if (args && args instanceof Array) {
      if (args.length < 3) {
        throw new Error(constants.MSG.ARGS_ERROR)
      } else {
        this.points = args
        this.geoJSON = {
          type: 'Polygon',
          coordinates: []
        }
      }
    } else {
      throw new Error(constants.MSG.ARGS_ERROR)
    }
  }

  toGeoJSON() {
    var coordinates = this.geoJSON.coordinates
    this.points.forEach((point) => {
      if (point instanceof GeoPoint) {
        coordinates.push([point.attitude, point.longitude])
      } else if (point instanceof Array && point.length === 2) {
        coordinates.push(point)
      } else {
        throw new Error(constants.MSG.ARGS_ERROR)
      }
    })
    return _cloneDeep(this.geoJSON)
  }
}

module.exports = GeoPolygon