const config = require('../../core/config')
const faker = require('faker')
const Query = require('../../core/Query')
const TableObject = require('../../core/TableObject')
const TableRecord = require('../../core/TableRecord')
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

  it('#createMany', () => {
    let createRecordList = sinon.stub(BaaS, 'createRecordList').callsFake(args => {
      expect(args).to.deep.equal({
        tableID: randomNumber,
        data: randomArray,
        enable_trigger: 1
      })
    })
    Product.createMany(randomArray)
    createRecordList.restore()
  })

  it('#delete one', () => {
    let deleteRecordStub = sinon.stub(BaaS, 'deleteRecord').resolves(randomString)
    return Product.delete(randomNumber).then((res) => {
      expect(res).to.equal(randomString)
      deleteRecordStub.restore()
    })
  })

  it('#delete more', () => {
    let deleteRecordList = sinon.stub(BaaS, 'deleteRecordList').callsFake(function (args) {
      expect(args).to.deep.equal({
        tableID: randomNumber,
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 500,
        offset: 0,
        enable_trigger: 1,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    Product.offset(0).limit(500).delete(query)
    expect(Product._limit).to.be.equal(20)
    deleteRecordList.restore()
  })

  it('#getWithoutData one', () => {
    let product = Product.getWithoutData(randomNumber)
    expect(product instanceof TableRecord).to.be.true
  })

  it('#getWithoutData more', () => {
    let query = new Query()
    query.in('price', randomArray)
    let records = Product.limit(350).offset(10).getWithoutData(query)
    expect(records instanceof TableRecord).to.be.true
    expect(records._queryObject).to.deep.equal({
      where: {
        '$and': [
          {
            'price': {'$in': randomArray}
          }
        ]
      },
      offset: 10,
      limit: 350
    })
    expect(records._recordID).to.be.null
    expect(Product._limit).to.be.equal(20)
    expect(Product._offset).to.be.equal(0)
  })

  it('#get', () => {
    let getRecordStub = sinon.stub(BaaS, 'getRecord').resolves(randomString)
    return Product.get(randomNumber).then((res) => {
      expect(res).to.equal(randomString)
      getRecordStub.restore()
    })
  })

  it('#get expand created_by', () => {
    let getRecord = sinon.stub(BaaS, 'getRecord')
    getRecord.callsFake(function (params) {
      expect(params.expand).to.equal('created_by')
    })
    Product.expand('created_by').get(randomNumber)
    getRecord.restore()
  })

  it('#get keys one', () => {
    let getRecord = sinon.stub(BaaS, 'getRecord')
    getRecord.callsFake(function (params) {
      expect(params.keys).to.equal('created_by')
    })
    Product.select('created_by').get(randomNumber)
    getRecord.restore()
  })

  it('#get keys more', () => {
    let getRecord = sinon.stub(BaaS, 'getRecord')
    getRecord.callsFake(function (params) {
      expect(params.keys).to.equal('-created_by,-created_at')
    })
    Product.select(['-created_by', '-created_at']).get(randomNumber)
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

  it('clear query params when get', () => {
    let getRecordStub = sinon.stub(BaaS, 'getRecord').resolves()
    return Product.expand('created_by').get(randomNumber).then(() => {
      expect(Product._expand).to.equal(null)
      getRecordStub.restore()
    })
  })

  it('clear query params when query', () => {
    let queryRecordListStub = sinon.stub(BaaS, 'queryRecordList').resolves()
    return Product.expand('created_by').limit(10).find(res => {
      expect(Product._limit).to.equal(20)
      queryRecordListStub.restore()
    })
  })
})
