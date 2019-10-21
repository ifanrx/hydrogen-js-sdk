const config = require('../../core/config')
const ContentGroup = require('../../core/ContentGroup')
const faker = require('faker')
const helper = require('./helper')
const Query = require('../../core/Query')

const randomOption = config.RANDOM_OPTION

describe('ContentGroup', () => {
  let randomArray, randomNumber

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

  it('#find without returnTotalCount', () => {
    let contentGroup = new ContentGroup(randomNumber)
    let getContentListV2 = sinon.stub(BaaS, 'getContentListV2').callsFake(function (args) {
      expect(args).to.deep.equal({
        contentGroupID: randomNumber,
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 0,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    contentGroup.setQuery(query).offset(0).find()
    getContentListV2.restore()
  })

  it('#find with returnTotalCount=true', () => {
    let contentGroup = new ContentGroup(randomNumber)
    let getContentListV2 = sinon.stub(BaaS, 'getContentListV2').callsFake(function (args) {
      expect(args).to.deep.equal({
        contentGroupID: randomNumber,
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 1,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    contentGroup.setQuery(query).offset(0).find({returnTotalCount: true})
    getContentListV2.restore()
  })

  it('#find with returnTotalCount=false', () => {
    let contentGroup = new ContentGroup(randomNumber)
    let getContentListV2 = sinon.stub(BaaS, 'getContentListV2').callsFake(function (args) {
      expect(args).to.deep.equal({
        contentGroupID: randomNumber,
        where: `{"$and":[{"price":{"$in":[${randomArray.join(',')}]}}]}`,
        limit: 20,
        offset: 0,
        return_total_count: 0,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    contentGroup.setQuery(query).offset(0).find({returnTotalCount: false})
    getContentListV2.restore()
  })

  it('#getCategoryList without returnTotalCount', () => {
    let contentGroup = new ContentGroup(randomNumber)
    let getContentCategoryList = sinon.stub(BaaS, 'getContentCategoryList').callsFake(function (args) {
      expect(args).to.deep.equal({
        contentGroupID: randomNumber,
        limit: 100,
        return_total_count: 0,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    contentGroup.getCategoryList()
    getContentCategoryList.restore()
  })

  it('#getCategoryList with returnTotalCount=true', () => {
    let contentGroup = new ContentGroup(randomNumber)
    let getContentCategoryList = sinon.stub(BaaS, 'getContentCategoryList').callsFake(function (args) {
      expect(args).to.deep.equal({
        contentGroupID: randomNumber,
        limit: 100,
        return_total_count: 1,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    contentGroup.getCategoryList({returnTotalCount: true})
    getContentCategoryList.restore()
  })

  it('#getCategoryList with returnTotalCount=false', () => {
    let contentGroup = new ContentGroup(randomNumber)
    let getContentCategoryList = sinon.stub(BaaS, 'getContentCategoryList').callsFake(function (args) {
      expect(args).to.deep.equal({
        contentGroupID: randomNumber,
        limit: 100,
        return_total_count: 0,
      })
    })
    let query = new Query()
    query.in('price', randomArray)
    contentGroup.getCategoryList({returnTotalCount: false})
    getContentCategoryList.restore()
  })
})
