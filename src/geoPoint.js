const _cloneDeep = require('lodash.clonedeep')

class GeoPoint {
  constructor(attitude, longitude) {
    this.attitude = attitude
    this.longitude = longitude
    this.geoJSON = {
      'type': 'Point',
      'coordinates': [this.attitude, this.longitude]
    }
  }

  toGeoJSON() {
    return _cloneDeep(this.geoJSON)
  }
}

module.exports = GeoPoint