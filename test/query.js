const Query = require('../src/query')

describe('query', () => {

  it('#_setQueryObject', () => {
    var query = new Query()
    var queryObj1 = {and: [{price__gt: 10}]}
    query._setQueryObject(queryObj1)
    expect(query.queryObject).to.deep.equal(queryObj1)
    var queryObj2 = {and: [{amount_lt: 10}]}
    query._setQueryObject(queryObj2)
    expect(query.queryObject).to.deep.equal(queryObj2)
  })

  it('#_addQueryObject', () => {
    var query = new Query()
    var queryObj1 = {price__gt: 10}
    query._addQueryObject(queryObj1)
    expect(query.queryObject).to.deep.equal({and: [queryObj1]})
    var queryObj2 = {amount_lt: 10}
    query._addQueryObject(queryObj2)
    var newQueryObj = {}
    expect(query.queryObject).to.deep.equal({and: [
      {price__gt: 10},
      {amount_lt: 10}
    ]})
  })

  it('#_assemblyQueryKey', () => {
    var query = new Query()
    expect(query._assemblyQueryKey('price', 'gt')).to.equal('price__gt')
  })

  it('#compare', () => {
    var query = new Query()
    query.compare('price', '<', 10)
    expect(query.queryObject).to.deep.equal({and: [{price__lt: 10}]})
  })

  it('#contains', () => {
    var query = new Query()
    query.contains('name', 'beef')
    expect(query.queryObject).to.deep.equal({and: [{name__contains: 'beef'}]})
  })

  it('#in', () => {
    var query = new Query()
    query.in('price', [1, 3, 4])
    expect(query.queryObject).to.deep.equal({and: [{price__in: '1,3,4'}]})
  })

  it('#notIn', () => {
    var query = new Query()
    query.notIn('price', [1, 3, 4])
    expect(query.queryObject).to.deep.equal({and: [{price__nin: '1,3,4'}]})
  })

  it('#isNull', () => {
    var query = new Query()
    query.isNull('price')
    expect(query.queryObject).to.deep.equal({and: [{price__isnull: true}]})
  })

  it('#isNotNull', () => {
    var query = new Query()
    query.isNotNull('price')
    expect(query.queryObject).to.deep.equal({and: [{price__isnull: false}]})
  })

  it('#static and', () => {
    var query1 = new Query()
    query1.contains('name', 'beef')
    var query2 = new Query()
    query2.isNull('price')
    var andQuery = Query.and(query1, query2)
    expect(andQuery.queryObject).to.deep.equal({
      and: [
        {and: [{name__contains: 'beef'}]},
        {and: [{price__isnull: true}]}
      ]
    })
  })

  it('#static or', () => {
    var query1 = new Query()
    query1.contains('name', 'beef')
    var query2 = new Query()
    query2.isNull('price')
    var orQuery = Query.or(query1, query2)
    expect(orQuery.queryObject).to.deep.equal({
      or: [
        {and: [{name__contains: 'beef'}]},
        {and: [{price__isnull: true}]}
      ]
    })
  })

  it('#static and && or', () => {
    var query1 = new Query()
    query1.contains('name', 'beef')
    var query2 = new Query()
    query2.isNull('price')
    var orQuery = Query.or(query1, query2)
    var query3 = new Query()
    query3.isNotNull('name')
    var andQuery = Query.and(orQuery, query3)
    expect(andQuery.queryObject).to.deep.equal({
      and: [
        {
          or: [
            {and: [{name__contains: 'beef'}]},
            {and: [{price__isnull: true}]}
          ]
        },
        {
          and: [{name__isnull: false}]
        }
      ]
    })
  })
})