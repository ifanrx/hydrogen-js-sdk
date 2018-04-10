require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const Query = require('../src/Query')
const TableObject = require('../src/TableObject')
const TableRecord = require('../src/TableRecord')
const randomOption = config.RANDOM_OPTION
const helper = require('./helper')

describe('TableObject', () => {
  let Product = null
  let randomNumber, randomString, randomArray

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomString = faker.lorem.words(1)
    randomArray = helper.generateRandomArray()
  })

  beforeEach(() => {
    Product = new TableObject(randomNumber)
  })

  it('#_tableID', () => {
    expect(Product._tableID).to.equal(randomNumber)
  })

  it('#create', () => {
    let product = Product.create()
    expect(product instanceof TableRecord).to.be.true
  })

  it('#delete', () => {
    let deleteRecord = sinon.stub(BaaS, 'deleteRecord')
    deleteRecord.returnsPromise().resolves(randomString)
    Product.get(randomNumber).then((res) => {
      expect(res).to.equal(randomString)
    })
    deleteRecord.restore()
  })

  it('#getWithoutData', () => {
    let product = Product.getWithoutData(randomNumber)
    expect(product instanceof TableRecord).to.be.true
  })

  it('#get', () => {
    let getRecord = sinon.stub(BaaS, 'getRecord')
    getRecord.returnsPromise().resolves(randomString)
    Product.get(randomNumber).then((res) => {
      expect(res).to.equal(randomString)
    })
    getRecord.restore()
  })

  it('#get expand created_by', () => {
    let getRecord = sinon.stub(BaaS, 'getRecord')
    getRecord.callsFake(function (params) {
      expect(params.expand).to.equal('created_by')
    })
    Product.expand('created_by').get(randomNumber)
    getRecord.restore()
  })

  it('#_handleAllQueryConditions', () => {
    let query = new Query()
    query.in('price', randomArray)
    Product.setQuery(query)
    Product.orderBy('-amount')
    expect(Product._handleAllQueryConditions()).to.deep.equal({
      tableID: randomNumber,
      limit: 20,
      offset: 0,
      order_by: '-amount',
      where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`
    })
  })
})