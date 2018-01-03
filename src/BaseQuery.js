const constants = require('./constants')
const Query = require('./Query')
const _cloneDeep = require('lodash.clonedeep')
const _isInteger = require('lodash/isInteger')

class BaseQuery {
  constructor() {
    this._queryObject = {}
    this._limit = 20
    this._offset = 0
    this._orderBy = null
  }

  setQuery(queryObject) {
    if (queryObject instanceof Query) {
      this._queryObject = _cloneDeep(queryObject.queryObject)
    } else {
      throw new Error(constants.MSG.ARGS_ERROR)
    }
    return this
  }

  limit(value) {
    if (!_isInteger(value)) {
      throw new Error(constants.MSG.ARGS_ERROR)
    }
    this._limit = value
    return this
  }

  offset(value) {
    if (!_isInteger(value)) {
      throw new Error(constants.MSG.ARGS_ERROR)
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

  _handleAllQueryConditions() {
    let conditions = {}
    conditions.limit = this._limit
    conditions.offset = this._offset
    if (this._orderBy) {
      conditions.order_by = this._orderBy
    }
    conditions.where = JSON.stringify(this._queryObject)
    return conditions
  }
}

module.exports = BaseQuery