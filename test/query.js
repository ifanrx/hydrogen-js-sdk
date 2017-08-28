const GeoPoint = require('../src/geoPoint')
const GeoPolygon = require('../src/geoPolygon')
const Query = require('../src/query')

describe('query', () => {
  it('#_setQueryObject', () => {
    var query = new Query()
    var queryObj1 = {
      $and: [
        {price: {$gt: 10}}
      ]
    }
    query._setQueryObject(queryObj1)
    expect(query.queryObject).to.deep.equal(queryObj1)
    var queryObj2 = {
      $and: [
        {amount: {$lt: 10}}
      ]
    }
    query._setQueryObject(queryObj2)
    expect(query.queryObject).to.deep.equal(queryObj2)
  })

  it('#_addQueryObject', () => {
    var query = new Query()
    query._addQueryObject('price', 'gt', 10)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$gt: 10}}
      ]
    })
    query._addQueryObject('amount', 'lt', 10)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$gt: 10}},
        {amount: {$lt: 10}}
      ]
    })
  })

  it('#compare', () => {
    var query = new Query()
    query.compare('price', '<', 10)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$lt: 10}}
      ]
    })
  })

  it('#contains', () => {
    var query = new Query()
    query.contains('name', 'beef')
    expect(query.queryObject).to.deep.equal({
      $and: [
        {name: {$contains: 'beef'}}
      ]
    })
  })

  it('#in', () => {
    var query = new Query()
    query.in('price', [1, 3, 4])
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$in: [1, 3, 4]}}
      ]
    })
  })

  it('#notIn', () => {
    var query = new Query()
    query.notIn('price', [1, 3, 4])
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$nin: [1, 3, 4]}}
      ]
    })
  })

  it('#isNull', () => {
    var query = new Query()
    query.isNull('price')
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$isnull: true}}
      ]
    })
  })

  it('#isNull array', () => {
    var query = new Query()
    query.isNull(['price', 'amount'])
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$isnull: true}},
        {amount: {$isnull: true}}
      ]
    })
  })

  it('#isNotNull', () => {
    var query = new Query()
    query.isNotNull('price')
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$isnull: false}}
      ]
    })
  })

  it('#isNotNull array', () => {
    var query = new Query()
    query.isNotNull(['price', 'amount'])
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$isnull: false}},
        {amount: {$isnull: false}}
      ]
    })
  })

  it('#include', () => {
    var query = new Query()
    var point = new GeoPoint(1, 1)
    query.include('geoField', point)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          geoField: {
            $intersects: {
              type: "Point",
              coordinates: [1, 1],
            }
          }
        }
      ]
    })
  })

  it('#within', () => {
    var query = new Query()
    var polygon = new GeoPolygon([[1, 1], [1, 1], [1, 1]])
    query.within('geoField', polygon)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          geoField: {
            $within: {
              type: "Polygon",
              coordinates: [[1, 1], [1, 1], [1, 1]],
            }
          }
        }
      ]
    })
  })

  it('#withinCircle', () => {
    var query = new Query()
    var point = new GeoPoint(1, 1)
    query.withinCircle('geoField', point, 1)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          geoField: {
            $center: {
              radius: 1,
              coordinates: [1, 1],
            }
          }
        }
      ]
    })
  })

  it('#withinRegion', () => {
    var query = new Query()
    var point = new GeoPoint(1, 1)
    query.withinRegion('geoField', point)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          geoField: {
            $nearsphere: {
              geometry: {
                type: "Point",
                coordinates: [1, 1]
              },
              min_distance: 0
            }
          }
        }
      ]
    })
  })

  it('#static and', () => {
    var query1 = new Query()
    query1.contains('name', 'beef')
    var query2 = new Query()
    query2.isNull('price')
    var andQuery = Query.and(query1, query2)
    expect(andQuery.queryObject).to.deep.equal({
      $and: [
        {
          $and: [
            {name: {$contains: 'beef'}}
          ]
        },
        {
          $and: [
            {price: {$isnull: true}}
          ]
        }
      ]
    })
  })

  it('#static or', () => {
    var query1 = new Query()
    query1.contains('name', 'beef')
    var query2 = new Query()
    query2.isNull('price')
    var orQuery = Query.or(query1, query2)
    expect(orQuery.queryObject).to.deep.equal({
      $or: [
        {
          $and: [
            {name: {$contains: 'beef'}}
          ]
        },
        {
          $and: [
            {price: {$isnull: true}}
          ]
        }
      ]
    })
  })

  it('#static and && or', () => {
    var query1 = new Query()
    query1.contains('name', 'beef')
    var query2 = new Query()
    query2.isNull('price')
    var orQuery = Query.or(query1, query2)
    var query3 = new Query()
    query3.isNotNull('name')
    var andQuery = Query.and(orQuery, query3)
    expect(andQuery.queryObject).to.deep.equal({
      $and: [
        {
          $or: [
            {
              $and: [
                {name: {$contains: 'beef'}}
              ]
            },
            {
              $and: [
                {price: {$isnull: true}}
              ]
            }
          ]
        },
        {
          $and: [
            {name: {$isnull: false}}
          ]
        }
      ]
    })
  })
})