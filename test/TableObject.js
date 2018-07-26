require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const Query = require('../src/Query')
const TableObject = require('../src/TableObject')
const TableRecord = require('../src/TableRecord')
const Aggregation = require('../src/Aggregation')
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
        data: randomArray
      })
    })
    Product.createMany(randomArray)
    createRecordList.restore()
  })

  it('#delete one', () => {
    let deleteRecord = sinon.stub(BaaS, 'deleteRecord')
    deleteRecord.returnsPromise().resolves(randomString)
    Product.get(randomNumber).then((res) => {
      expect(res).to.equal(randomString)
    })
    deleteRecord.restore()
  })

  it('#delete more', () => {
    let deleteRecordList = sinon.stub(BaaS, 'deleteRecordList').callsFake(function (args) {
      expect(args).to.deep.equal({
        tableID: randomNumber,
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 500,
        offset: 0
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
    Product.expand('created_by').get(randomNumber)
    expect(Product._expand).to.equal(null)
  })

  it('clear query params when query', () => {
    Product.expand('created_by').limit(10).find()
    expect(Product._limit).to.equal(20)
  })

  it('clear query params when aggregate', () => {
    let aggregation = new Aggregation()
    aggregation.sample(10).count('count')
    Product.setAggregation(aggregation).limit(10).find()
    expect(Product._limit).to.equal(20)
    expect(Product._aggregation).to.equal(null)
  })

  it('#check aggregation params', () => {
    let aggregation = new Aggregation()
    aggregation
      .sample(10)
      .group({
        _id: '$status',
        count: {
          $sum: 1
        },
        totalAmount: {
          $sum: '$amount'
        },
        avgAmount: {
          $avg: '$amount'
        }
      })
      .project({
        _id: 0,
        newFieldName: ['$x', '$y']
      })
      .count('count')

    let query = new Query()
    query.compare('price', '=', 1)

    Product.setQuery(query).setAggregation(aggregation).limit(10).offset(2).orderBy(['created_by', 'updated_at'])
    expect(Product._handleAllQueryConditions()).to.deep.equal({
      tableID: randomNumber,
      limit: 10,
      offset: 2,
      order_by: 'created_by,updated_at',
      aggregate: JSON.stringify([{
          $sample: {
            size: 10
          }
        }, {
          $group: {
            _id: '$status',
            count: {
              $sum: 1
            },
            totalAmount: {
              $sum: '$amount'
            },
            avgAmount: {
              $avg: '$amount'
            }
          }
        }, {
          $project: {
            _id: 0,
            newFieldName: ['$x', '$y']
          }
        }, {
          $count: 'count'
        }]
      )
    })
  })
})
