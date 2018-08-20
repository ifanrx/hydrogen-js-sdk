const utils = require('./utils')

class GeoPoint {
  constructor(longitude, latitude) {
    this.longitude = longitude
    this.latitude = latitude
    this.geoJSON = {
      'type': 'Point',
      'coordinates': [this.longitude, this.latitude]
    }
  }

  toGeoJSON() {
    return utils.cloneDeep(this.geoJSON)
  }
}

module.exports = GeoPoint