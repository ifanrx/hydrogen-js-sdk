require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const ContentGroup = require('../src/ContentGroup')
const faker = require('faker')
const helper = require('./helper')
const Query = require('../src/Query')

const randomOption = config.RANDOM_OPTION

describe('ContentGroup', () => {
  let contentGroup = null
  let randomArray

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomArray = helper.generateRandomArray()
  })

  it('new ContentGroup', () => {
    let contentGroup = new ContentGroup(randomNumber)
    expect(contentGroup._contentGroupID).to.equal(randomNumber)
  })

  it('#_handleAllQueryConditions', () => {
    let contentGroup = new ContentGroup(randomNumber)
    let query = new Query()
    query.in('id', randomArray)
    contentGroup.setQuery(query)
    contentGroup.orderBy(['-name', 'size'])
    contentGroup.limit(10)
    expect(contentGroup._handleAllQueryConditions()).to.deep.equal({
      limit: 10,
      offset: 0,
      order_by: '-name,size',
      where: `{"$and":[{"id":{"$in":[${randomArray.join(',')}]}}]}`
    })
  })
})