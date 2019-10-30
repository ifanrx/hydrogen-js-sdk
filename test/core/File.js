const File = require('../../core/File')
const helper = require('./helper')
const Query = require('../../core/Query')

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
    let getFileListStub = sinon.stub(BaaS, 'getFileList')
    file.limit(10).find()
    expect(file._limit).to.equal(null)
    getFileListStub.restore()
  })

  it('#find without withCount', () => {
    let getFileList = sinon.stub(BaaS, 'getFileList').callsFake(function (args) {
      expect(args).to.deep.equal({
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 0,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    file.setQuery(query).offset(0).find()
    getFileList.restore()
  })

  it('#find with withCount=true', () => {
    let getFileList = sinon.stub(BaaS, 'getFileList').callsFake(function (args) {
      expect(args).to.deep.equal({
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 1,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    file.setQuery(query).offset(0).find({withCount: true})
    getFileList.restore()
  })

  it('#find with withCount=false', () => {
    let getFileList = sinon.stub(BaaS, 'getFileList').callsFake(function (args) {
      expect(args).to.deep.equal({
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 0,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    file.setQuery(query).offset(0).find({withCount: false})
    getFileList.restore()
  })
})
