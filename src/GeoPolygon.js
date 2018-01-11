const GeoPoint = require('./GeoPoint')
const HError = require('./HError')
const _cloneDeep = require('lodash.clonedeep')

class GeoPolygon {
  constructor(args) {
    if (args && args instanceof Array) {
      if (args.length < 4) {
        throw new HError(605)
      } else {
        this.points = args
        this.geoJSON = {
          type: 'Polygon',
          coordinates: []
        }
      }
    } else {
      throw new HError(605)
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
        throw new HError(605)
      }
    })
    coordinates.push(face)
    return _cloneDeep(this.geoJSON)
  }
}

module.exports = GeoPolygon