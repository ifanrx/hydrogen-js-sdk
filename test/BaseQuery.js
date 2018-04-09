require('../src/baasRequest').createRequestMethod()
const BaseQuery = require('../src/BaseQuery')
const config = require('../src/config')
const faker = require('faker')
const helper = require('./helper')
const Query = require('../src/Query')
const randomOption = config.RANDOM_OPTION

describe('BaseQuery', () => {
  let baseQuery = null
  let randomNumber, randomArray

  beforeEach(() => {
    baseQuery = new BaseQuery()
  })

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomArray = helper.generateRandomArray()
  })

  it('#setQuery Query', () => {
    let query = new Query()
    query.in('price', randomArray)
    baseQuery.setQuery(query)
    expect(baseQuery._queryObject).to.deep.equal({
      $and: [
        {price: {$in: randomArray}}
      ]
    })
    query.compare('amount', '<', randomNumber)
    baseQuery.setQuery(query)
    expect(baseQuery._queryObject).to.deep.equal({
      $and: [
        {price: {$in: randomArray}},
        {amount: {$lt: randomNumber}}
      ]
    })
  })

  it('#setQuery illegal', () => {
    expect(() => baseQuery.setQuery('')).to.throw()
    expect(() => baseQuery.setQuery(1)).to.throw()
  })

  it('#limit', () => {
    baseQuery.limit(randomNumber)
    expect(baseQuery._limit).to.equal(randomNumber)
    baseQuery.limit(0)
    expect(baseQuery._limit).to.equal(0)
  })

  it('#limit illegal', () => {
    expect(() => baseQuery.limit('')).to.throw()
    expect(() => baseQuery.limit()).to.throw()
  })

  it('#offset', () => {
    baseQuery.offset(randomNumber)
    expect(baseQuery._offset).to.equal(randomNumber)
    baseQuery.offset(0)
    expect(baseQuery._offset).to.equal(0)
  })

  it('#offset illegal', () => {
    expect(() => baseQuery.offset('')).to.throw()
    expect(() => baseQuery.offset()).to.throw()
  })

  it('#orderBy one', () => {
    baseQuery.orderBy('-amount')
    expect(baseQuery._orderBy).to.equal('-amount')
  })

  it('#orderBy more', () => {
    baseQuery.orderBy(['-amount', 'price'])
    expect(baseQuery._orderBy).to.equal('-amount,price')
  })

  it('#expand', () => {
    baseQuery.expand('created_by')
    expect(baseQuery._expand).to.equal('created_by')
  })

  it('#expand array args', () => {
    baseQuery.expand(['created_by', 'test'])
    expect(baseQuery._expand).to.equal('created_by,test')
  })

  it('#_handleAllQueryConditions', () => {
    let query = new Query()
    query.in('price', randomArray)
    baseQuery.setQuery(query)
    baseQuery.orderBy('-amount')
    expect(baseQuery._handleAllQueryConditions()).to.deep.equal({
      limit: 20,
      offset: 0,
      order_by: '-amount',
      where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`
    })
  })
})