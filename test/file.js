require('../src/baasRequest').createRequestMethod()
const config = require('../src/config')
const faker = require('faker')
const File = require('../src/file')
const Query = require('../src/query')
const helper = require('./helper')

describe('file', () => {
  let file = null
  let randomArray

  beforeEach(() => {
    file = new File()
  })

  before(() => {
    randomArray = helper.generateRandomArray()
  })

  it('#_handleAllQueryConditions', () => {
    var query = new Query()
    query.in('id', randomArray)
    file.setQuery(query)
    file.orderBy(['-name', 'size'])
    file.limit(10)
    expect(file._handleAllQueryConditions()).to.deep.equal({
      limit: 10,
      offset: 0,
      order_by: '-name,size',
      where: `{"$and":[{"id":{"$in":[${randomArray.join(',')}]}}]}`
    })
  })
})