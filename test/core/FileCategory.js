const FileCategory = require('../../core/FileCategory')
const helper = require('./helper')
const Query = require('../../core/Query')

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
    let query = new Query()
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

  it('clear query params when query', () => {
    fileCategory.limit(10).find()
    expect(fileCategory._limit).to.equal(20)
  })
})
