const File = require('../core/File')
const helper = require('./helper')
const Query = require('../core/Query')

describe('File', () => {
  let file = null
  let randomArray

  beforeEach(() => {
    file = new File()
  })

  before(() => {
    randomArray = helper.generateRandomArray()
  })

  it('#_handleAllQueryConditions', () => {
    let query = new Query()
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

  it('clear query params when query', () => {
    file.limit(10).find()
    expect(file._limit).to.equal(20)
  })
})
