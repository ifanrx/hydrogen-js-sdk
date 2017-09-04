const GeoPoint = require('../src/geoPoint')
const GeoPolygon = require('../src/geoPolygon')

describe('geoPolygon', () => {
  it('#new with 2D array', () => {
    var face = [[1, 1], [1, 1], [1, 1], [1, 1]]
    var polygon = new GeoPolygon(face)
    expect(polygon.toGeoJSON()).to.deep.equal({
      type: 'Polygon',
      coordinates: [face]
    })
  })

  it('#new with GeoPoint array', () => {
    var point1 = new GeoPoint(1, 1)
    var point2 = new GeoPoint(1, 1)
    var point3 = new GeoPoint(1, 1)
    var point4 = new GeoPoint(1, 1)
    var polygon = new GeoPolygon([point1, point2, point3, point4])
    expect(polygon.toGeoJSON()).to.deep.equal({
      type: 'Polygon',
      coordinates: [[[1, 1], [1, 1], [1, 1], [1, 1]]]
    })
  })

  it('#new illegal', () => {
    expect(() => new GeoPolygon()).to.throw()
    expect(() => new GeoPolygon('')).to.throw()
    var point1 = new GeoPoint(1, 1)
    var point2 = new GeoPoint(1, 1)
    expect(() => new GeoPolygon([point1, point2])).to.throw()
  })
})