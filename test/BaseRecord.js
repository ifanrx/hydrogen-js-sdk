require('../src/baasRequest').createRequestMethod()
const BaseRecord = require('../src/BaseRecord')
const config = require('../src/config')
const faker = require('faker')
const helper = require('./helper')
const GeoPoint = require('../src/GeoPoint')
const GeoPolygon = require('../src/GeoPolygon')

const randomOption = config.RANDOM_OPTION

describe('BaseRecord', () => {
  let product = null
  let randomNumber, randomNumber1, randomNumber2, randomArray

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomNumber1 = faker.random.number(randomOption)
    randomNumber2 = faker.random.number(randomOption)
    randomArray = helper.generateRandomArray()
  })

  beforeEach(() => {
    product = new BaseRecord(randomNumber)
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
      random2DArray.push(helper.generateRandomArray(2))
    }
    var randomPolygon = new GeoPolygon(random2DArray)
    product.set({'geoPolygon': randomPolygon})
    expect(product._record).to.deep.equal({geoPolygon: {
      'type': 'Polygon',
      'coordinates': [random2DArray]
    }})
  })

  it('#set illegal', () => {
    expect(() => product.set('')).to.throw()
    expect(() => product.set('', '', '')).to.throw()
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