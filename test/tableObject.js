require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const Query = require('../src/query')
const TableObject = require('../src/tableObject')
const TableRecord = require('../src/tableRecord')
const randomOption = config.RANDOM_OPTION
const utils = require('../src/utils')

describe('tableObject', () => {
  let Product = null
  let randomNumber, randomNumber1, randomNumber2, randomString, randomArray

  before(() => {
    Product = new TableObject(1)
    randomNumber = faker.random.number(randomOption)
    randomNumber1 = faker.random.number(randomOption)
    randomNumber2 = faker.random.number(randomOption)
    randomString = faker.lorem.words(1)
    randomArray = utils.generateRandomArray()
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
    var product = Product.create()
    expect(product instanceof TableRecord).to.be.true
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
    var product = Product.getWithoutData(randomNumber)
    expect(product instanceof TableRecord).to.be.true
  })

  it('#get', () => {
    let getRecord = sinon.stub(BaaS, 'getRecord')
    getRecord.returnsPromise().resolves(randomString)
    Product.get(1).then((res) => {
      expect(res).to.equal(randomString)
    })
    getRecord.restore()
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
    Product.limit(0)
    expect(Product._limit).to.equal(0)
  })

  it('#limit illegal', () => {
    expect(() => Product.limit('')).to.throw()
    expect(() => Product.limit()).to.throw()
  })

  it('#offset', () => {
    Product.offset(randomNumber)
    expect(Product._offset).to.equal(randomNumber)
    Product.offset(0)
    expect(Product._offset).to.equal(0)
  })

  it('#offset illegal', () => {
    expect(() => Product.offset('')).to.throw()
    expect(() => Product.offset()).to.throw()
  })
})