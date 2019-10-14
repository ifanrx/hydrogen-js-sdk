const config = require('../../core/config')
const faker = require('faker')
const Query = require('../../core/Query')
const User = require('../../core/User')
const UserRecord = require('../../core/UserRecord')

const randomOption = config.RANDOM_OPTION

describe('User', () => {
  let user = null
  let randomNumber, randomString

  beforeEach(() => {
    user = new User()
  })

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomString = faker.lorem.words(1)
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

    let getUserListStub = sinon.stub(BaaS, 'getUserList').resolves()
    return user.limit(10).find(() => {
      expect(user._limit).to.equal(null)
      getUserListStub.restore()
    })
  })
})
