const GeoPoint = require('../core/GeoPoint')

describe('GeoPoint', () => {
  it('#new', () => {
    let point = new GeoPoint(10, 20)
    expect(point.longitude).to.equal(10)
    expect(point.latitude).to.equal(20)
  })

  it('#toGeoJSON', () => {
    let point = new GeoPoint(10, 20)
    expect(point.toGeoJSON()).to.deep.equal({
      'type': 'Point',
      'coordinates': [10, 20]
    })
  })
})