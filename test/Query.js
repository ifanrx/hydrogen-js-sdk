const config = require('../core/config')
const faker = require('faker')
const GeoPoint = require('../core/GeoPoint')
const GeoPolygon = require('../core/GeoPolygon')
const helper = require('./helper')
const Query = require('../core/Query')

const randomOption = config.RANDOM_OPTION

describe('Query', () => {
  let randomNumber, randomNumber1, randomNumber2, randomString, randomArray, regExpString

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomNumber1 = faker.random.number(randomOption)
    randomNumber2 = faker.random.number(randomOption)
    randomString = faker.lorem.words(1)
    randomArray = helper.generateRandomArray()
    regExpString = '^[a-zA-Z]+[0-9]*\\W?_$'
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
    query._addQueryObject('price', {gt: randomNumber})
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$gt: randomNumber}}
      ]
    })
    query._addQueryObject('amount', {lt: randomNumber})
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$gt: randomNumber}},
        {amount: {$lt: randomNumber}}
      ]
    })
  })

  it('#_addQueryObject complex', () => {
    let query = new Query()
    query._addQueryObject('price', {gt: randomNumber, in: [randomNumber1, randomNumber2]})
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {
          $gt: randomNumber,
          $in: [randomNumber1, randomNumber2]
        }}
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

  it('#matches', () => {
    let query = new Query()

    query.matches('name', new RegExp(regExpString))
    expect(query.queryObject).to.deep.equal({
      $and: [
        {name: {
          $regex: regExpString
        }}
      ]
    })
  })

  it('#matches complex', () => {
    let query = new Query()

    query.matches('name', new RegExp(regExpString, 'gi'))
    expect(query.queryObject).to.deep.equal({
      $and: [
        {name: {
          $regex: regExpString,
          $options: 'gi'
        }}
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

  it('#arrayContains', () => {
    let query = new Query()
    query.arrayContains('desc', randomArray)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {desc: {$all: randomArray}}
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

  it('#exists', () => {
    let query = new Query()
    query.exists('price')
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$exists: true}}
      ]
    })
  })

  it('#exists array', () => {
    let query = new Query()
    query.exists(['price', 'amount'])
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$exists: true}},
        {amount: {$exists: true}}
      ]
    })
  })

  it('#notExists', () => {
    let query = new Query()
    query.notExists('price')
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$exists: false}}
      ]
    })
  })

  it('#notExists array', () => {
    let query = new Query()
    query.notExists(['price', 'amount'])
    expect(query.queryObject).to.deep.equal({
      $and: [
        {price: {$exists: false}},
        {amount: {$exists: false}}
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
              type: 'Point',
              coordinates: [randomNumber1, randomNumber2],
            }
          }
        }
      ]
    })
  })

  it('#within', () => {
    let query = new Query()
    let random2DArray = []
    for(let i = 0; i < 5; i++) {
      random2DArray.push(helper.generateRandomArray(2))
    }
    let randomPolygon = new GeoPolygon(random2DArray)
    query.within('geoField', randomPolygon)
    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          geoField: {
            $within: {
              type: 'Polygon',
              coordinates: [random2DArray],
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
                type: 'Point',
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

  it('#object - hasKey', () => {
    let query = new Query()
    query.hasKey('objectField', 'key1')

    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          objectField: {
            $has_key: 'key1'
          }
        }
      ]
    })
  })

  it('#object - eq', () => {
    let query = new Query()
    query.compare('objectField', '=', {a: randomArray, b: randomNumber})

    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          objectField: {
            $eq: {a: randomArray, b: randomNumber}
          }
        }
      ]
    })
  })

  it('#object - isnull', () => {
    let query = new Query()
    query.isNull('objectField')

    expect(query.queryObject).to.deep.equal({
      $and: [
        {
          objectField: {
            $isnull: true
          }
        }
      ]
    })
  })

})