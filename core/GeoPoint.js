const utils = require('./utils')

/**
 * @typedef GeoJson
 * @property {string} type 类型
 * @property {number[]} coordinates 坐标
 */

/**
 * GeoPoint
 * @memberof BaaS
 * @public
 */
class GeoPoint {
  /**
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   */
  constructor(longitude, latitude) {
    this.longitude = longitude
    this.latitude = latitude
    this.geoJSON = {
      'type': 'Point',
      'coordinates': [this.longitude, this.latitude]
    }
  }

  /**
   * 转换为 GeoJSON
   * @return {GeoJson}
   */
  toGeoJSON() {
    return utils.cloneDeep(this.geoJSON)
  }
}

module.exports = GeoPoint
