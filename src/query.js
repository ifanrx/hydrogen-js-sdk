class Query {
  constructor() {
    this.queryObject = {}
  }

  static and(...queryObjects) {
    var newQuery = new Query()
    var andQuery = {and: []}
    queryObjects.forEach(function(query) {
      andQuery.and.push(query.queryObject)
    })
    newQuery._setQueryObject(andQuery)
    return newQuery
  }

  static or(...queryObjects) {
    var newQuery = new Query()
    var orQuery = {or: []}
    queryObjects.forEach(function(query) {
      orQuery.or.push(query.queryObject)
    })
    newQuery._setQueryObject(orQuery)
    return newQuery
  }

  compare(key, operator, value) {
    var op = 'eq'
    switch(operator) {
      case '=':
        op = 'eq'
        break
      case '!=':
        op = 'ne'
        break
      case '<':
        op = 'lt'
        break
      case '<=':
        op = 'lte'
        break
      case '>':
        op = 'gt'
        break
      case '>=':
        op = 'gte'
        break
      default:
        throw new Error('arguments error')
    }
    this._addQueryObject({[this._assemblyQueryKey(key, op)]: value})
    return this
  }

  contains(key, str) {
    this._addQueryObject({[this._assemblyQueryKey(key, 'contains')]: str})
    return this
  }

  in(key, arr) {
    this._addQueryObject({[this._assemblyQueryKey(key, 'in')]: arr.join(',')})
    return this
  }

  notIn(key, arr) {
    this._addQueryObject({[this._assemblyQueryKey(key, 'nin')]: arr.join(',')})
    return this
  }

  isNull(key) {
    this._addQueryObject({[this._assemblyQueryKey(key, 'isnull')]: true})
    return this
  }

  isNotNull(key) {
    this._addQueryObject({[this._assemblyQueryKey(key, 'isnull')]: false})
    return this
  }

  _setQueryObject(queryObject) {
    this.queryObject = queryObject
  }

  _addQueryObject(query) {
    if(!this.queryObject.and) {
      this.queryObject.and = []
    }
    this.queryObject.and.push(query)
  }

  _assemblyQueryKey(key, operator) {
    return `${key}__${operator}`
  }
}

module.exports = Query