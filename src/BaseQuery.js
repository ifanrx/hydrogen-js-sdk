const HError = require('./HError')
const Query = require('./Query')
const Aggregation = require('./Aggregation')
const _cloneDeep = require('lodash.clonedeep')
const _isInteger = require('lodash/isInteger')

class BaseQuery {
  constructor() {
    this._initQueryParams()
  }

  _initQueryParams() {
    this._queryObject = {}
    this._limit = 20
    this._offset = 0
    this._orderBy = null
    this._keys = null
    this._expand = null
    this._aggregation = null
  }

  setQuery(queryObject) {
    if (queryObject instanceof Query) {
      this._queryObject = _cloneDeep(queryObject.queryObject)
    } else {
      throw new HError(605)
    }
    return this
  }

  setAggregation(aggregation) {
    if (aggregation instanceof Aggregation) {
      this._aggregation = aggregation
    } else {
      throw new HError(605)
    }
    return this
  }

  limit(value) {
    if (!_isInteger(value)) {
      throw new HError(605)
    }
    this._limit = value
    return this
  }

  offset(value) {
    if (!_isInteger(value)) {
      throw new HError(605)
    }
    this._offset = value
    return this
  }

  orderBy(args) {
    if (args instanceof Array) {
      this._orderBy = args.join(',')
    } else {
      this._orderBy = args
    }
    return this
  }

  select(args) {
    if (args instanceof Array) {
      this._keys = args.join(',')
    } else {
      this._keys = args
    }
    return this
  }

  expand(args) {
    if (args instanceof Array) {
      this._expand = args.join(',')
    } else {
      this._expand = args
    }
    return this
  }

  _handleAllQueryConditions() {
    let conditions = {}
    conditions.limit = this._limit
    conditions.offset = this._offset
    if (this._orderBy) {
      conditions.order_by = this._orderBy
    }
    if (this._keys) {
      conditions.keys = this._keys
    }

    if (this._expand) {
      conditions.expand = this._expand
    }

    if (this._aggregation) {
      conditions.aggregate = JSON.stringify(this._aggregation.getPipeline())
    } else {
      conditions.where = JSON.stringify(this._queryObject)
    }
    return conditions
  }
}

module.exports = BaseQuery
