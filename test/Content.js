require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const Content = require('../src/Content')
const faker = require('faker')
const helper = require('./helper')
const Query = require('../src/Query')

const randomOption = config.RANDOM_OPTION

describe('Content', () => {
  let content = null
  let randomArray

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomArray = helper.generateRandomArray()
  })

  it('new Content', () => {
    let content = new Content(randomNumber)
    expect(content._contentGroupID).to.equal(randomNumber)
  })

  it('#_handleAllQueryConditions', () => {
    let content = new Content(randomNumber)
    let query = new Query()
    query.in('id', randomArray)
    content.setQuery(query)
    content.orderBy(['-name', 'size'])
    content.limit(10)
    expect(content._handleAllQueryConditions()).to.deep.equal({
      limit: 10,
      offset: 0,
      order_by: '-name,size',
      where: `{"$and":[{"id":{"$in":[${randomArray.join(',')}]}}]}`
    })
  })
})