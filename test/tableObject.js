require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const GeoPoint = require('../src/geoPoint')
const GeoPolygon = require('../src/geoPolygon')
const Query = require('../src/query')
const TableObject = require('../src/tableObject')
const randomOption = config.RANDOM_OPTION
const utils = require('../src/utils')

describe('tableObject', () => {
  let Product = null
  let randomNumber, randomNumber1, randomNumber2, randomString, randomArray

  before(() => {
    Product = new TableObject(1)
    randomNumber = faker.random.number()
    randomNumber1 = faker.random.number()
    randomNumber2 = faker.random.number()
    randomString = faker.lorem.words(1)
    randomArray = utils.generateRandomArray()
  })

  it('#_resetTableObject', () => {
    isCleared(Product)
  })

  it('#_handleQueryObject', () => {
    var query = new Query()
    query.in('price', randomArray)
    Product.setQuery(query)
    Product.orderBy('-amount')
    expect(Product._handleQueryObject()).to.deep.equal({
      tableID: 1,
      limit: 20,
      offset: 0,
      order_by: '-amount',
      where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`
    })
  })

  it('#create', () => {
    Product.create()
    isCleared(Product)
  })

  it('#set key && value', () => {
    Product.set({})
    Product.set('price', randomNumber1)
    Product.set('amount', randomNumber2)
    expect(Product._record).to.deep.equal({price: randomNumber1, amount: randomNumber2})
  })

  it('#set object', () => {
    Product.set({price: randomNumber1})
    Product.set({amount: randomNumber2})
    expect(Product._record).to.deep.equal({amount: randomNumber2})
  })

  it('#set GeoPoint', () => {
    var randomPoint = new GeoPoint(randomNumber1, randomNumber2)
    Product.set({'geoPoint': randomPoint})
    expect(Product._record).to.deep.equal({geoPoint: {
      'type': 'Point',
      'coordinates': [randomNumber1, randomNumber2]
    }})
  })

  it('#set GeoPolygon', () => {
    var random2DArray = []
    for(var i = 0; i < 5; i++) {
      random2DArray.push(utils.generateRandomArray(2))
    }
    var randomPolygon = new GeoPolygon(random2DArray)
    Product.set({'geoPolygon': randomPolygon})
    expect(Product._record).to.deep.equal({geoPolygon: {
      'type': 'Polygon',
      'coordinates': random2DArray
    }})
  })

  it('#set illegal', () => {
    expect(() => Product.set('')).to.throw()
    expect(() => Product.set('', '', '')).to.throw()
  })

  it('#save', () => {
    let createRecord = sinon.stub(BaaS, 'createRecord')
    createRecord.returnsPromise().resolves(randomString)
    Product.set('key', 'value')
    Product.save().then((res) => {
      expect(res).to.equal(randomString)
    })
    expect(Product._record).to.deep.equal({})
    createRecord.restore()
  })

  it('#delete', () => {
    let deleteRecord = sinon.stub(BaaS, 'deleteRecord')
    deleteRecord.returnsPromise().resolves(randomString)
    Product.get(1).then((res) => {
      expect(res).to.equal(randomString)
    })
    deleteRecord.restore()
  })

  it('#getWithoutData', () => {
    Product.getWithoutData(randomNumber)
    expect(Product._recordID).to.equal(randomNumber)
  })

  it('#update', () => {
    let updateRecord = sinon.stub(BaaS, 'updateRecord')
    updateRecord.returnsPromise().resolves(randomString)
    Product.set('key', 'value')
    Product.update().then((res) => {
      expect(res).to.equal(randomString)
    })
    expect(Product._record).to.deep.equal({})
    updateRecord.restore()
  })

  it('#get', () => {
    let getRecord = sinon.stub(BaaS, 'getRecord')
    getRecord.returnsPromise().resolves(randomString)
    Product.get(1).then((res) => {
      expect(res).to.equal(randomString)
    })
    getRecord.restore()
  })

  it('#incrementBy', () => {
    Product.set({})
    Product.incrementBy('price', randomNumber)
    expect(Product._record).to.deep.equal({price: {$incr_by: randomNumber}})
  })

  it('#append', () => {
    Product.set({})
    Product.append('arr', randomNumber)
    expect(Product._record).to.deep.equal({arr: {$append: [randomNumber]}})
    Product.append('arr', randomArray)
    expect(Product._record).to.deep.equal({arr: {$append: randomArray}})
  })

  it('#uAppend', () => {
    Product.set({})
    Product.uAppend('arr', randomNumber)
    expect(Product._record).to.deep.equal({arr: {$append_unique: [randomNumber]}})
    var randomArray = []
    Product.uAppend('arr', randomArray)
    expect(Product._record).to.deep.equal({arr: {$append_unique: randomArray}})
  })

  it('#remove', () => {
    Product.set({})
    Product.remove('arr', randomNumber)
    expect(Product._record).to.deep.equal({arr: {$remove: [randomNumber]}})
    Product.remove('arr', randomArray)
    expect(Product._record).to.deep.equal({arr: {$remove: randomArray}})
  })

  it('#setQuery Query', () => {
    var query = new Query()
    query.in('price', randomArray)
    Product.setQuery(query)
    expect(Product._queryObject).to.deep.equal({
      $and: [
        {price: {$in: randomArray}}
      ]
    })
    query.compare('amount', '<', randomNumber)
    Product.setQuery(query)
    expect(Product._queryObject).to.deep.equal({
      $and: [
        {price: {$in: randomArray}},
        {amount: {$lt: randomNumber}}
      ]
      })
  })

  it('#setQuery illegal', () => {
    expect(() => Product.setQuery('')).to.throw()
    expect(() => Product.setQuery(1)).to.throw()
  })

  it('#limit', () => {
    Product.limit(randomNumber)
    expect(Product._limit).to.equal(randomNumber)
  })

  it('#limit illegal', () => {
    expect(() => Product.limit('')).to.throw()
    expect(() => Product.limit()).to.throw()
  })

  it('#offset', () => {
    Product.offset(randomNumber)
    expect(Product._offset).to.equal(randomNumber)
  })

  it('#offset illegal', () => {
    expect(() => Product.offset('')).to.throw()
    expect(() => Product.offset()).to.throw()
  })

  it('#find', () => {

  })
})

function isCleared(Product) {
  expect(Product._queryObject).to.deep.equal({})
  expect(Product._record).to.deep.equal({})
  expect(Product._recordID).to.be.a('null')
  expect(Product._limit).to.equal(20)
  expect(Product._offset).to.equal(0)
  expect(Product._orderBy).to.be.a('null')
}