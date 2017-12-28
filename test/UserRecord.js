require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const helper = require('./helper')
const UserRecord = require('../src/UserRecord')

const randomOption = config.RANDOM_OPTION

describe('UserRecord', () => {
  let user = null
  let randomNumber, randomString

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomString = faker.lorem.words(1)
  })

  it('#update', () => {
    user = new UserRecord(randomNumber)
    let updateUser = sinon.stub(BaaS, 'updateUser')
    updateUser.returnsPromise().resolves(randomString)
    user.set('key', 'value')
    user.update().then((res) => {
      expect(res).to.equal(randomString)
    })
    expect(user._record).to.deep.equal({})
    updateUser.restore()
  })
})