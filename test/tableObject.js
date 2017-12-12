require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const Query = require('../src/query')
const TableObject = require('../src/tableObject')
const TableRecord = require('../src/tableRecord')
const randomOption = config.RANDOM_OPTION
const helper = require('./helper')

describe('tableObject', () => {
  let Product = null
  let randomNumber, randomString, randomArray

  beforeEach(() => {
    Product = new TableObject(1)
  })

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomString = faker.lorem.words(1)
    randomArray = helper.generateRandomArray()
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

  it('#_handleAllQueryConditions', () => {
    var query = new Query()
    query.in('price', randomArray)
    Product.setQuery(query)
    Product.orderBy('-amount')
    expect(Product._handleAllQueryConditions()).to.deep.equal({
      tableID: 1,
      limit: 20,
      offset: 0,
      order_by: '-amount',
      where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`
    })
  })
})