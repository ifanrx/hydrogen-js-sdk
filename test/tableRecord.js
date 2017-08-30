require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const GeoPoint = require('../src/geoPoint')
const GeoPolygon = require('../src/geoPolygon')
const TableRecord = require('../src/tableRecord')
const randomOption = config.RANDOM_OPTION
const util = require('../util')

describe('tableRecord', () => {
  let product = null
  let randomNumber, randomNumber1, randomNumber2, randomString, randomArray

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomNumber1 = faker.random.number(randomOption)
    randomNumber2 = faker.random.number(randomOption)
    randomString = faker.lorem.words(1)
    randomArray = util.generateRandomArray()
  })

  beforeEach(() => {
    product = new TableRecord(randomNumber)
  })

  it('#set key && value', () => {
    product.set('price', randomNumber1)
    product.set('amount', randomNumber2)
    expect(product._record).to.deep.equal({price: randomNumber1, amount: randomNumber2})
  })

  it('#set object', () => {
    product.set({price: randomNumber1})
    product.set({amount: randomNumber2})
    expect(product._record).to.deep.equal({amount: randomNumber2})
  })

  it('#set GeoPoint', () => {
    var randomPoint = new GeoPoint(randomNumber1, randomNumber2)
    product.set({'geoPoint': randomPoint})
    expect(product._record).to.deep.equal({geoPoint: {
      'type': 'Point',
      'coordinates': [randomNumber1, randomNumber2]
    }})
  })

  it('#set GeoPolygon', () => {
    var random2DArray = []
    for(var i = 0; i < 5; i++) {
      random2DArray.push(util.generateRandomArray(2))
    }
    var randomPolygon = new GeoPolygon(random2DArray)
    product.set({'geoPolygon': randomPolygon})
    expect(product._record).to.deep.equal({geoPolygon: {
      'type': 'Polygon',
      'coordinates': random2DArray
    }})
  })

  it('#set illegal', () => {
    expect(() => product.set('')).to.throw()
    expect(() => product.set('', '', '')).to.throw()
  })

  it('#save', () => {
    let createRecord = sinon.stub(BaaS, 'createRecord')
    createRecord.returnsPromise().resolves(randomString)
    product.set('key', 'value')
    product.save().then((res) => {
      expect(res).to.equal(randomString)
    })
    expect(product._record).to.deep.equal({})
    createRecord.restore()
  })

  it('#update', () => {
    product = new TableRecord(randomNumber1, randomNumber2)
    let updateRecord = sinon.stub(BaaS, 'updateRecord')
    updateRecord.returnsPromise().resolves(randomString)
    product.set('key', 'value')
    product.update().then((res) => {
      expect(res).to.equal(randomString)
    })
    expect(product._record).to.deep.equal({})
    updateRecord.restore()
  })

  it('#incrementBy', () => {
    product.incrementBy('price', randomNumber)
    expect(product._record).to.deep.equal({price: {$incr_by: randomNumber}})
  })

  it('#append', () => {
    product.append('arr', randomNumber)
    expect(product._record).to.deep.equal({arr: {$append: [randomNumber]}})
    product.append('arr', randomArray)
    expect(product._record).to.deep.equal({arr: {$append: randomArray}})
  })

  it('#uAppend', () => {
    product.uAppend('arr', randomNumber)
    expect(product._record).to.deep.equal({arr: {$append_unique: [randomNumber]}})
    var randomArray = []
    product.uAppend('arr', randomArray)
    expect(product._record).to.deep.equal({arr: {$append_unique: randomArray}})
  })

  it('#remove', () => {
    product.remove('arr', randomNumber)
    expect(product._record).to.deep.equal({arr: {$remove: [randomNumber]}})
    product.remove('arr', randomArray)
    expect(product._record).to.deep.equal({arr: {$remove: randomArray}})
  })
})