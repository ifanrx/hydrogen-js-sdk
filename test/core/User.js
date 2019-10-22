const config = require('../../core/config')
const faker = require('faker')
const Query = require('../../core/Query')
const User = require('../../core/User')
const UserRecord = require('../../core/UserRecord')
const helper = require('./helper')

const randomOption = config.RANDOM_OPTION

describe('User', () => {
  let user = null
  let randomNumber, randomString, randomArray

  beforeEach(() => {
    user = new User()
  })

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomString = faker.lorem.words(1)
    randomArray = helper.generateRandomArray()
  })

  it('#get', () => {
    let getUserDetail = sinon.stub(BaaS, 'getUserDetail')
    getUserDetail.returnsPromise().resolves(randomString)
    user.get(1).then((res) => {
      expect(res).to.equal(randomString)
    })
    getUserDetail.restore()
  })

  it('#getCurrentUserWithoutData', () => {
    let someone = user.getCurrentUserWithoutData()
    expect(someone instanceof UserRecord).to.be.true
  })

  it('#_handleAllQueryConditions', () => {
    let query = new Query()
    query.compare('age', '>', randomNumber)
    user.setQuery(query)
    user.orderBy('-age')
    expect(user._handleAllQueryConditions()).to.deep.equal({
      limit: 20,
      offset: 0,
      order_by: '-age',
      where: `{"$and":[{"age":{"$gt":${randomNumber}}}]}`
    })
  })

  it('#_handleAllQueryConditions with limit', () => {
    let query = new Query()
    query.compare('age', '>', randomNumber)
    user.setQuery(query)
    user.limit(30)
    user.orderBy('-age')
    expect(user._handleAllQueryConditions()).to.deep.equal({
      limit: 30,
      offset: 0,
      order_by: '-age',
      where: `{"$and":[{"age":{"$gt":${randomNumber}}}]}`
    })
  })

  it('clear query params when query', () => {
    let getUserListStub = sinon.stub(BaaS, 'getUserList')
    user.limit(10).find()
    expect(user._limit).to.equal(null)
    getUserListStub.restore()
  })

  it('#find without withCount', () => {
    let getUserListStub = sinon.stub(BaaS, 'getUserList').callsFake(function (args) {
      expect(args).to.deep.equal({
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 0,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    user.setQuery(query).offset(0).find()
    expect(user._limit).to.be.equal(null)
    getUserListStub.restore()
  })

  it('#find with withCount=true', () => {
    let getUserListStub = sinon.stub(BaaS, 'getUserList').callsFake(function (args) {
      expect(args).to.deep.equal({
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 1,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    user.setQuery(query).offset(0).find({withCount: true})
    expect(user._limit).to.be.equal(null)
    getUserListStub.restore()
  })

  it('#find with withCount=false', () => {
    let getUserListStub = sinon.stub(BaaS, 'getUserList').callsFake(function (args) {
      expect(args).to.deep.equal({
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 0,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    user.setQuery(query).offset(0).find({withCount: false})
    expect(user._limit).to.be.equal(null)
    getUserListStub.restore()
  })
})
