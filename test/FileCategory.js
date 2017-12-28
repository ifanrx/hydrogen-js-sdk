require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const FileCategory = require('../src/FileCategory')
const Query = require('../src/Query')
const helper = require('./helper')

describe('FileCategory', () => {
  let fileCategory = null
  let randomArray

  beforeEach(() => {
    fileCategory = new FileCategory()
  })

  before(() => {
    randomArray = helper.generateRandomArray()
  })

  it('#_handleAllQueryConditions', () => {
    var query = new Query()
    query.in('id', randomArray)
    fileCategory.setQuery(query)
    fileCategory.orderBy(['-name', 'created_at'])
    fileCategory.limit(10)
    expect(fileCategory._handleAllQueryConditions()).to.deep.equal({
      limit: 10,
      offset: 0,
      order_by: '-name,created_at',
      where: `{"$and":[{"id":{"$in":[${randomArray.join(',')}]}}]}`
    })
  })
})