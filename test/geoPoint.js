const GeoPoint = require('../src/geoPoint')

describe('geoPoint', () => {
  it('#new', () => {
    var point = new GeoPoint(10, 20)
    expect(point.attitude).to.equal(10)
    expect(point.longitude).to.equal(20)
  })

  it('#toGeoJSON', () => {
    var point = new GeoPoint(10, 20)
    expect(point.toGeoJSON()).to.deep.equal({
      'type': 'Point',
      'coordinates': [10, 20]
    })
  })
})