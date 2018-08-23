const GeoPoint = require('./GeoPoint')
const HError = require('./HError')
const utils = require('./utils')

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
        face.push([point.longitude, point.latitude])
      } else if (point instanceof Array && point.length === 2) {
        face.push(point)
      } else {
        throw new HError(605)
      }
    })
    coordinates.push(face)
    return utils.cloneDeep(this.geoJSON)
  }
}

module.exports = GeoPolygon