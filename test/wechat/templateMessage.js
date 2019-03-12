const makeParams = require('../../sdk-file/src/wechat/templateMessage').makeParams
const faker = require('faker')

describe('templateMessage', () => {
  let randomString
  before(() => {
    randomString = faker.lorem.words(1)
  })

  it('#makeParams error', () => {
    expect(() => makeParams()).to.throw()
  })

  it('#makeParams', () => {
    let result1 = makeParams(randomString)
    expect(result1).to.deep.equal({'submission_type': 'form_id', submission_value: randomString})
  })
})
