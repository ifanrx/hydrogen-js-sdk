const config = require('../../core/config')
const faker = require('faker')
const TableRecord = require('../../core/TableRecord')
const Query = require('../../core/Query')
const helper = require('./helper')

const randomOption = config.RANDOM_OPTION

describe('TableRecord', () => {
  let product = null
  let randomNumber, randomNumber1, randomNumber2, randomString

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomNumber1 = faker.random.number(randomOption)
    randomNumber2 = faker.random.number(randomOption)
    randomString = faker.lorem.words(1)
  })

  beforeEach(() => {
    product = new TableRecord(randomNumber)
  })

  it('#save', () => {
    let createRecord = sinon.stub(BaaS, 'createRecord')
    createRecord.returnsPromise().resolves(randomString)
    product.set('key', 'value')
    product.save().then((res) => {
      expect(res).to.equal(randomString)
    })
    expect(product._record).to.deep.equal({
      $set: {},
      $unset: {},
    })
    createRecord.restore()
  })

  it('#update one', () => {
    product = new TableRecord(randomNumber1, randomNumber2)
    let updateRecord = sinon.stub(BaaS, 'updateRecord')
    updateRecord.returnsPromise().resolves(randomString)
    product.set('key', 'value')
    product.update().then((res) => {
      expect(res).to.equal(randomString)
    })
    expect(product._record).to.deep.equal({
      $set: {},
      $unset: {},
    })
    updateRecord.restore()
  })

  it('#update more without enableTrigger', () => {
    let query = new Query()
    const randomArray = helper.generateRandomArray()
    query.in('price', randomArray)
    const queryObject = {
      where: query.queryObject,
      limit: 20,
      offset: 0
    }
    let records = new TableRecord(randomNumber1, null, queryObject)
    records.set('price', 6)
    expect(records._recordID).to.be.equal.null
    const updateRecordList = sinon.stub(BaaS, 'updateRecordList').callsFake(args => {
      expect(args).to.deep.equal({
        tableID: randomNumber1,
        data: {
          $set: {
            price: 6
          },
          $unset: {}
        },
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        offset: 0,
        limit: 20,
        enable_trigger: 1,
        return_total_count: 0,
      })
    })
    records.update()
    expect(records._queryObject).to.deep.equal({})
    updateRecordList.restore()
  })

  it('#update more with enableTrigger=false', () => {
    let query = new Query()
    const randomArray = helper.generateRandomArray()
    query.in('price', randomArray)
    const queryObject = {
      where: query.queryObject,
      limit: null,
      offset: 0
    }
    let records = new TableRecord(randomNumber1, null, queryObject)
    records.set('price', 6)
    expect(records._recordID).to.be.equal.null
    const updateRecordList = sinon.stub(BaaS, 'updateRecordList').callsFake(args => {
      expect(args).to.deep.equal({
        tableID: randomNumber1,
        data: {
          $set: {
            price: 6
          },
          $unset: {}
        },
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        offset: 0,
        limit: undefined,
        enable_trigger: 0,
        return_total_count: 0,
      })
    })
    records.update({enableTrigger: false})
    expect(records._queryObject).to.deep.equal({})
    updateRecordList.restore()
  })

  it('#update more with enableTrigger=true', () => {
    let query = new Query()
    const randomArray = helper.generateRandomArray()
    query.in('price', randomArray)
    const queryObject = {
      where: query.queryObject,
      limit: null,
      offset: 0
    }
    let records = new TableRecord(randomNumber1, null, queryObject)
    records.set('price', 6)
    expect(records._recordID).to.be.equal.null
    const updateRecordList = sinon.stub(BaaS, 'updateRecordList').callsFake(args => {
      expect(args).to.deep.equal({
        tableID: randomNumber1,
        data: {
          $set: {
            price: 6
          },
          $unset: {}
        },
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        offset: 0,
        limit: 20,
        enable_trigger: 1,
        return_total_count: 0,
      })
    })
    records.update({enableTrigger: true})
    expect(records._queryObject).to.deep.equal({})
    updateRecordList.restore()
  })

  it('#update more without returnTotalCount', () => {
    let query = new Query()
    const randomArray = helper.generateRandomArray()
    query.in('price', randomArray)
    const queryObject = {
      where: query.queryObject,
      limit: 20,
      offset: 0
    }
    let records = new TableRecord(randomNumber1, null, queryObject)
    records.set('price', 6)
    expect(records._recordID).to.be.equal.null
    const updateRecordList = sinon.stub(BaaS, 'updateRecordList').callsFake(args => {
      expect(args).to.deep.equal({
        tableID: randomNumber1,
        data: {
          $set: {
            price: 6
          },
          $unset: {}
        },
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        offset: 0,
        limit: 20,
        enable_trigger: 1,
        return_total_count: 0,
      })
    })
    records.update()
    expect(records._queryObject).to.deep.equal({})
    updateRecordList.restore()
  })

  it('#update more with returnTotalCount=true', () => {
    let query = new Query()
    const randomArray = helper.generateRandomArray()
    query.in('price', randomArray)
    const queryObject = {
      where: query.queryObject,
      limit: 20,
      offset: 0
    }
    let records = new TableRecord(randomNumber1, null, queryObject)
    records.set('price', 6)
    expect(records._recordID).to.be.equal.null
    const updateRecordList = sinon.stub(BaaS, 'updateRecordList').callsFake(args => {
      expect(args).to.deep.equal({
        tableID: randomNumber1,
        data: {
          $set: {
            price: 6
          },
          $unset: {}
        },
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        offset: 0,
        limit: 20,
        enable_trigger: 1,
        return_total_count: 1,
      })
    })
    records.update({returnTotalCount: true})
    expect(records._queryObject).to.deep.equal({})
    updateRecordList.restore()
  })

  it('#update more with returnTotalCount=false', () => {
    let query = new Query()
    const randomArray = helper.generateRandomArray()
    query.in('price', randomArray)
    const queryObject = {
      where: query.queryObject,
      limit: 20,
      offset: 0
    }
    let records = new TableRecord(randomNumber1, null, queryObject)
    records.set('price', 6)
    expect(records._recordID).to.be.equal.null
    const updateRecordList = sinon.stub(BaaS, 'updateRecordList').callsFake(args => {
      expect(args).to.deep.equal({
        tableID: randomNumber1,
        data: {
          $set: {
            price: 6
          },
          $unset: {}
        },
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        offset: 0,
        limit: 20,
        enable_trigger: 1,
        return_total_count: 0,
      })
    })
    records.update({returnTotalCount: false})
    expect(records._queryObject).to.deep.equal({})
    updateRecordList.restore()
  })
})
