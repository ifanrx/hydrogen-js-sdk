require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const TableRecord = require('../src/TableRecord')

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
    expect(product._record).to.deep.equal({})
    createRecord.restore()
  })

  it('#update', () => {
    product = new TableRecord(randomNumber1, randomNumber2)
    let updateRecord = sinon.stub(BaaS, 'updateRecord')
    updateRecord.returnsPromise().resolves(randomString)
    product.set('key', 'value')
    product.update().then((res) => {
      expect(res).to.equal(randomString)
    })
    expect(product._record).to.deep.equal({})
    updateRecord.restore()
  })
})