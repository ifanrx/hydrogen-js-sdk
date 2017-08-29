const config = require('../src/config')
const faker = require('faker')
const GeoPoint = require('../src/geoPoint')
const GeoPolygon = require('../src/geoPolygon')
const Query = require('../src/query')
const utils = require('../src/utils')

const randomOption = config.RANDOM_OPTION

describe('query', () => {
  let randomNumber, randomNumber1, randomNumber2, randomString, randomArray

  before(() => {
    randomNumber = faker.random.number()
    randomNumber1 = faker.random.number()
    randomNumber2 = faker.random.number()
    randomString = faker.lorem.words(1)
    randomArray = utils.generateRandomArray()
  })

  it('#_setQueryObject', () => {
    let query = new Query()
    let queryObj1 = {
      $and: [
        {price: {$gt: randomNumber}}
      ]
    }
    query._setQueryObject(queryObj1)
    expect(query.queryObject).to.deep.equal(queryObj1)
    let queryObj2 = {
      $and: [
        {amount: {$lt: randomNumber}}
      ]
    }
    query._setQueryObject(queryObj2)
    expect(query.queryObject).to.deep.equal(queryObj2)
  })

  it('#_addQueryObject', () => {
    let query = new Query()
    query._addQueryObject('price', 'gt', randomNumber)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$gt: randomNumber}}
      ]
    })
    query._addQueryObject('amount', 'lt', randomNumber)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$gt: randomNumber}},
        {amount: {$lt: randomNumber}}
      ]
    })
  })

  it('#compare', () => {
    let query = new Query()
    query.compare('price', '<', randomNumber)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$lt: randomNumber}}
      ]
    })
  })

  it('#contains', () => {
    let query = new Query()
    query.contains('name', randomString)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {name: {$contains: randomString}}
      ]
    })
  })

  it('#in', () => {
    let query = new Query()
    query.in('price', randomArray)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$in: randomArray}}
      ]
    })
  })

  it('#notIn', () => {
    let query = new Query()
    query.notIn('price', randomArray)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$nin: randomArray}}
      ]
    })
  })

  it('#isNull', () => {
    let query = new Query()
    query.isNull('price')
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$isnull: true}}
      ]
    })
  })

  it('#isNull array', () => {
    let query = new Query()
    query.isNull(['price', 'amount'])
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$isnull: true}},
        {amount: {$isnull: true}}
      ]
    })
  })

  it('#isNotNull', () => {
    let query = new Query()
    query.isNotNull('price')
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$isnull: false}}
      ]
    })
  })

  it('#isNotNull array', () => {
    let query = new Query()
    query.isNotNull(['price', 'amount'])
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$isnull: false}},
        {amount: {$isnull: false}}
      ]
    })
  })

  it('#include', () => {
    let query = new Query()
    let randomPoint = new GeoPoint(randomNumber1, randomNumber2)
    query.include('geoField', randomPoint)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          geoField: {
            $intersects: {
              type: "Point",
              coordinates: [randomNumber1, randomNumber2],
            }
          }
        }
      ]
    })
  })

  it('#within', () => {
    let query = new Query()
    var random2DArray = []
    for(var i = 0; i < 5; i++) {
      random2DArray.push(utils.generateRandomArray(2))
    }
    var randomPolygon = new GeoPolygon(random2DArray)
    query.within('geoField', randomPolygon)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          geoField: {
            $within: {
              type: "Polygon",
              coordinates: random2DArray,
            }
          }
        }
      ]
    })
  })

  it('#withinCircle', () => {
    let query = new Query()
    let randomPoint = new GeoPoint(randomNumber1, randomNumber2)
    query.withinCircle('geoField', randomPoint, randomNumber)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          geoField: {
            $center: {
              radius: randomNumber,
              coordinates: [randomNumber1, randomNumber2],
            }
          }
        }
      ]
    })
  })

  it('#withinRegion', () => {
    let query = new Query()
    let randomPoint = new GeoPoint(randomNumber1, randomNumber2)
    query.withinRegion('geoField', randomPoint)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          geoField: {
            $nearsphere: {
              geometry: {
                type: "Point",
                coordinates: [randomNumber1, randomNumber2]
              },
              min_distance: 0
            }
          }
        }
      ]
    })
  })

  it('#static and', () => {
    let query1 = new Query()
    query1.contains('name', randomString)
    let query2 = new Query()
    query2.isNull('price')
    let andQuery = Query.and(query1, query2)
    expect(andQuery.queryObject).to.deep.equal({
      $and: [
        {
          $and: [
            {name: {$contains: randomString}}
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
    let query1 = new Query()
    query1.contains('name', randomString)
    let query2 = new Query()
    query2.isNull('price')
    let orQuery = Query.or(query1, query2)
    expect(orQuery.queryObject).to.deep.equal({
      $or: [
        {
          $and: [
            {name: {$contains: randomString}}
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
    let query1 = new Query()
    query1.contains('name', randomString)
    let query2 = new Query()
    query2.isNull('price')
    let orQuery = Query.or(query1, query2)
    let query3 = new Query()
    query3.isNotNull('name')
    let andQuery = Query.and(orQuery, query3)
    expect(andQuery.queryObject).to.deep.equal({
      $and: [
        {
          $or: [
            {
              $and: [
                {name: {$contains: randomString}}
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