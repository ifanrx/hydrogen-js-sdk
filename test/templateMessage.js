const makeParams = require('../src/templateMessage').makeParams
const faker = require('faker')

describe('templateMessage', () => {
  let randomString
  before(() => {
    randomString = faker.lorem.words(1)
  })

  it('#makeParams error', () => {
    expect(() => Product.makeParams()).to.throw()
    expect(() => Product.makeParams({})).to.throw()
    expect(() => Product.makeParams('type', randomString)).to.throw()
  })

  it('#makeParams', () => {
    var result1 = makeParams('form_id', randomString)
    var result2 = makeParams('prepay_id', randomString)
    expect(result1).to.deep.equal({'submission_type': 'form_id', submission_value: randomString})
    expect(result2).to.deep.equal({'submission_type': 'prepay_id', submission_value: randomString})
  })
})