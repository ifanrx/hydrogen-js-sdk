const GeoPoint = require('../core/GeoPoint')
const GeoPolygon = require('../core/GeoPolygon')
const TableObject = require('../core/TableObject')

describe('GeoPolygon', () => {
  it('#new with 2D array', () => {
    let face = [[1, 1], [1, 1], [1, 1], [1, 1]]
    let polygon = new GeoPolygon(face)
    expect(polygon.toGeoJSON()).to.deep.equal({
      type: 'Polygon',
      coordinates: [face]
    })
  })

  it('#new with GeoPoint array', () => {
    let point1 = new GeoPoint(1, 1)
    let point2 = new GeoPoint(1, 1)
    let point3 = new GeoPoint(1, 1)
    let point4 = new GeoPoint(1, 1)
    let polygon = new GeoPolygon([point1, point2, point3, point4])
    expect(polygon.toGeoJSON()).to.deep.equal({
      type: 'Polygon',
      coordinates: [[[1, 1], [1, 1], [1, 1], [1, 1]]]
    })
  })

  it('#new illegal', () => {
    expect(() => new GeoPolygon()).to.throw()
    expect(() => new GeoPolygon('')).to.throw()
    let point1 = new GeoPoint(1, 1)
    let point2 = new GeoPoint(1, 1)
    expect(() => new GeoPolygon([point1, point2])).to.throw()
  })

  it('#multi set', () => {
    let Product = new TableObject('test')
    let product = Product.create()
    let polygon_t = new GeoPolygon([[10, 10], [20, 10], [30, 20], [10, 10]])
    product.set('geo', polygon_t)
    product.set('geo', polygon_t)
    expect(polygon_t.geoJSON.coordinates).deep.equal([[[10, 10], [20, 10], [30, 20], [10, 10]]])
  })
})
