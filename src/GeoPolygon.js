const GeoPoint = require('./GeoPoint')
const _cloneDeep = require('lodash.clonedeep')
const constants = require('./constants')

class GeoPolygon {
  constructor(args) {
    if (args && args instanceof Array) {
      if (args.length < 4) {
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
    let coordinates = this.geoJSON.coordinates
    let face = []
    this.points.forEach((point) => {
      if (point instanceof GeoPoint) {
        face.push([point.attitude, point.longitude])
      } else if (point instanceof Array && point.length === 2) {
        face.push(point)
      } else {
        throw new Error(constants.MSG.ARGS_ERROR)
      }
    })
    coordinates.push(face)
    return _cloneDeep(this.geoJSON)
  }
}

module.exports = GeoPolygon