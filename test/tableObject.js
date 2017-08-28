require('../src/baasRequest').createRequestMethod()
const GeoPoint = require('../src/geoPoint')
const GeoPolygon = require('../src/geoPolygon')
const Query = require('../src/query')
const TableObject = require('../src/tableObject')

describe('tableObject', () => {
  let Product = null

  before(() => {
    Product = new TableObject(1)
  })

  it('#_resetTableObject', () => {
    isCleared(Product)
  })

  it('#_handleQueryObject', () => {
    var query = new Query()
    query.in('price', [1, 3, 4])
    Product.setQuery(query)
    Product.orderBy('-amount')
    expect(Product._handleQueryObject()).to.deep.equal({
      tableID: 1,
      limit: 20,
      offset: 0,
      order_by: '-amount',
      where: '{"$and":[{"price":{"$in":[1,3,4]}}]}'
    })
  })

  it('#create', () => {
    Product.create()
    isCleared(Product)
  })

  it('#set key && value', () => {
    Product.set({})
    Product.set('price', 10)
    Product.set('amount', 10)
    expect(Product._record).to.deep.equal({price: 10, amount: 10})
  })

  it('#set object', () => {
    Product.set({price: 10})
    Product.set({amount: 10})
    expect(Product._record).to.deep.equal({amount: 10})
  })

  it('#set GeoPoint', () => {
    var point = new GeoPoint(1, 1)
    Product.set({'geoPoint': point})
    expect(Product._record).to.deep.equal({geoPoint: {
      'type': 'Point',
      'coordinates': [1, 1]
    }})
  })

  it('#set GeoPolygon', () => {
    var polygon = new GeoPolygon([[1, 1], [1, 1], [1, 1]])
    Product.set({'geoPolygon': polygon})
    expect(Product._record).to.deep.equal({geoPolygon: {
      'type': 'Polygon',
      'coordinates': [[1, 1], [1, 1], [1, 1]]
    }})
  })

  it('#set illegal', () => {
    expect(() => Product.set('test')).to.throw()
    expect(() => Product.set('test', 'test', 'test')).to.throw()
  })

  it('#save', () => {
    let createRecord = sinon.stub(BaaS, 'createRecord')
    createRecord.returnsPromise().resolves('success')
    Product.set('key', 'value')
    Product.save().then((res) => {
      expect(res).to.equal('success')
    })
    expect(Product._record).to.deep.equal({})
    createRecord.restore()
  })

  it('#save without setting', () => {
    expect(() => Product.save()).to.throw()
  })

  it('#delete', () => {
    let deleteRecord = sinon.stub(BaaS, 'deleteRecord')
    deleteRecord.returnsPromise().resolves('success')
    Product.get(1).then((res) => {
      expect(res).to.equal('success')
    })
    deleteRecord.restore()
  })

  it('#getWithoutData', () => {
    Product.getWithoutData(1)
    expect(Product._recordID).to.equal(1)
  })

  it('#update', () => {
    let updateRecord = sinon.stub(BaaS, 'updateRecord')
    updateRecord.returnsPromise().resolves('success')
    Product.set('key', 'value')
    Product.update().then((res) => {
      expect(res).to.equal('success')
    })
    expect(Product._record).to.deep.equal({})
    updateRecord.restore()
  })

  it('#get', () => {
    let getRecord = sinon.stub(BaaS, 'getRecord')
    getRecord.returnsPromise().resolves('success')
    Product.get(1).then((res) => {
      expect(res).to.equal('success')
    })
    getRecord.restore()
  })

  it('#incrementBy', () => {
    Product.set({})
    Product.incrementBy('price', -1)
    expect(Product._record).to.deep.equal({price: {$incr_by: -1}})
  })

  it('#append', () => {
    Product.set({})
    Product.append('arr', 1)
    expect(Product._record).to.deep.equal({arr: {$append: [1]}})
    Product.append('arr', [1, 3])
    expect(Product._record).to.deep.equal({arr: {$append: [1, 3]}})
  })

  it('#uAppend', () => {
    Product.set({})
    Product.uAppend('arr', 1)
    expect(Product._record).to.deep.equal({arr: {$append_unique: [1]}})
    Product.uAppend('arr', [1, 3])
    expect(Product._record).to.deep.equal({arr: {$append_unique: [1, 3]}})
  })

  it('#remove', () => {
    Product.set({})
    Product.remove('arr', 1)
    expect(Product._record).to.deep.equal({arr: {$remove: [1]}})
    Product.remove('arr', [1, 3])
    expect(Product._record).to.deep.equal({arr: {$remove: [1, 3]}})
  })

  it('#setQuery Query', () => {
    var query = new Query()
    query.in('price', [1, 3, 4])
    Product.setQuery(query)
    expect(Product._queryObject).to.deep.equal({
      $and: [
        {price: {$in: [1, 3, 4]}}
      ]
    })
    query.compare('amount', '<', 10)
    Product.setQuery(query)
    expect(Product._queryObject).to.deep.equal({
      $and: [
        {price: {$in: [1, 3, 4]}},
        {amount: {$lt: 10}}
      ]
      })
  })

  it('#setQuery illegal', () => {
    expect(() => Product.setQuery('')).to.throw()
    expect(() => Product.setQuery(1)).to.throw()
  })

  it('#limit', () => {
    Product.limit(10)
    expect(Product._limit).to.equal(10)
  })

  it('#limit illegal', () => {
    expect(() => Product.limit('')).to.throw()
    expect(() => Product.limit()).to.throw()
  })

  it('#offset', () => {
    Product.offset(10)
    expect(Product._offset).to.equal(10)
  })

  it('#offset illegal', () => {
    expect(() => Product.offset('')).to.throw()
    expect(() => Product.offset()).to.throw()
  })

  it('#find', () => {

  })
})

function isCleared(Product) {
  expect(Product._queryObject).to.deep.equal({})
  expect(Product._record).to.deep.equal({})
  expect(Product._recordID).to.be.a('null')
  expect(Product._limit).to.equal(20)
  expect(Product._offset).to.equal(0)
  expect(Product._orderBy).to.be.a('null')
}