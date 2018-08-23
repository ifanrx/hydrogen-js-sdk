require('../core/baasRequest').createRequestMethod()
const BaseRecord = require('../core/BaseRecord')
const config = require('../core/config')
const faker = require('faker')
const GeoPoint = require('../core/GeoPoint')
const GeoPolygon = require('../core/GeoPolygon')
const helper = require('./helper')

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

  it('#_recordID', () => {
    expect(product._recordID).to.equal(randomNumber)
  })

  it('#set key && value', () => {
    product.set('price', randomNumber1)
    product.set('amount', randomNumber2)
    product.set('obj1', {a: randomNumber1, b: randomArray})
    expect(product._record).to.deep.equal({price: randomNumber1, amount: randomNumber2, obj1: {a:randomNumber1, b:randomArray}})
  })

  it('#set object', () => {
    product.set({price: randomNumber1})
    product.set({amount: randomNumber2})
    product.set({obj1: {a:randomNumber1, b:randomArray}})
    expect(product._record).to.deep.equal({obj1: {a:randomNumber1, b:randomArray}})
  })

  it('#set GeoPoint', () => {
    let randomPoint = new GeoPoint(randomNumber1, randomNumber2)
    product.set({'geoPoint': randomPoint})
    expect(product._record).to.deep.equal({geoPoint: {
      'type': 'Point',
      'coordinates': [randomNumber1, randomNumber2]
    }})
  })

  it('#set GeoPolygon', () => {
    let random2DArray = []
    for(let i = 0; i < 5; i++) {
      random2DArray.push(helper.generateRandomArray(2))
    }
    let randomPolygon = new GeoPolygon(random2DArray)
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
    let randomArray = []
    product.uAppend('arr', randomArray)
    expect(product._record).to.deep.equal({arr: {$append_unique: randomArray}})
  })

  it('#remove', () => {
    product.remove('arr', randomNumber)
    expect(product._record).to.deep.equal({arr: {$remove: [randomNumber]}})
    product.remove('arr', randomArray)
    expect(product._record).to.deep.equal({arr: {$remove: randomArray}})
  })

  it('#patchObject',() => {
    product.patchObject('obj1', {a:randomArray, b:randomNumber})
    expect(product._record).to.deep.equal({obj1: {$update: {a:randomArray, b:randomNumber}}})
  })
})