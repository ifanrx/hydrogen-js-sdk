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
    let getFileCategoryListStub = sinon.stub(BaaS, 'getFileCategoryList')
    fileCategory.limit(10).find()
    expect(fileCategory._limit).to.equal(null)
    getFileCategoryListStub.restore()
  })

  it('#find without withCount', () => {
    let getFileCategoryList = sinon.stub(BaaS, 'getFileCategoryList').callsFake(function (args) {
      expect(args).to.deep.equal({
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 0,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    fileCategory.setQuery(query).offset(0).find()
    getFileCategoryList.restore()
  })

  it('#find with withCount=true', () => {
    let getFileCategoryList = sinon.stub(BaaS, 'getFileCategoryList').callsFake(function (args) {
      expect(args).to.deep.equal({
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 1,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    fileCategory.setQuery(query).offset(0).find({withCount: true})
    getFileCategoryList.restore()
  })

  it('#find with withCount=false', () => {
    let getFileCategoryList = sinon.stub(BaaS, 'getFileCategoryList').callsFake(function (args) {
      expect(args).to.deep.equal({
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 0,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    fileCategory.setQuery(query).offset(0).find({withCount: false})
    getFileCategoryList.restore()
  })
})
