require('../src/baasRequest').createRequestMethod()
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

  it('#create', () => {
    Product.create()
    isCleared(Product)
  })

  it('#set key && value', () => {
    Product.set('price', 10)
    Product.set('amount', 10)
    expect(Product._record).to.deep.equal({price: 10, amount: 10})
  })

  it('#set object', () => {
    Product.set({price: 10})
    Product.set({amount: 10})
    expect(Product._record).to.deep.equal({amount: 10})
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

  it('#setQuery object', () => {
    Product.setQuery({price__gt: 10})
    expect(Product._queryObject).to.deep.equal({price__gt: 10})
    expect(Product._queryMode).to.equal('simple')
    Product.setQuery({amount__gt: 10})
    expect(Product._queryObject).to.deep.equal({amount__gt: 10})
    expect(Product._queryMode).to.equal('simple')
  })

  it('#setQuery Query', () => {
    var query = new Query()
    query.in('price', [1, 3, 4])
    Product.setQuery(query)
    expect(Product._queryObject).to.deep.equal({and: [{price__in: '1,3,4'}]})
    expect(Product._queryMode).to.equal('complex')
    query.compare('amount', '<', 10)
    Product.setQuery(query)
    expect(Product._queryObject).to.deep.equal({and: [{price__in: '1,3,4'}, {amount__lt: 10}]})
    expect(Product._queryMode).to.equal('complex')
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
}