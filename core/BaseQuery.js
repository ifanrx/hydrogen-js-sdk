const HError = require('./HError')
const Query = require('./Query')
const utils = require('./utils')
const constants = require('./constants')

/**
 * @memberof BaaS
 * @package
 */
class BaseQuery {
  constructor() {
    this._initQueryParams()
  }

  _initQueryParams() {
    this._queryObject = {}
    this._limit = null
    this._offset = 0
    this._orderBy = null
    this._keys = null
    this._expand = null
  }

  /**
   * 设置查询条件
   * 
   * @param {BaaS.Query} Query 对象
   * @return {this}
   */
  setQuery(queryObject) {
    if (queryObject instanceof Query) {
      this._queryObject = utils.cloneDeep(queryObject.queryObject)
    } else {
      throw new HError(605)
    }
    return this
  }

  /**
   * 选择只返回某些字段
   * 
   * @param {string[]|string} key 字段名称
   * @return {this}
   */
  select(args) {
    if (args instanceof Array) {
      this._keys = args.join(',')
    } else {
      this._keys = args
    }
    return this
  }

  /**
   * 设置需要展开的 pointer 类型字段
   * 
   * @param {string[]|string} key 字段名称
   * @return {this}
   */
  expand(args) {
    if (args instanceof Array) {
      this._expand = args.join(',')
    } else {
      this._expand = args
    }
    return this
  }

  /**
   * 设置返回数量
   * 
   * @param {number} count 数量
   * @return {this}
   */
  limit(value) {
    if (!Number.isInteger(value)) {
      throw new HError(605)
    }
    this._limit = value
    return this
  }

  /**
   * 设置列表偏移量
   * 
   * @param {number} count 偏移量
   * @return {this}
   */
  offset(value) {
    if (!Number.isInteger(value)) {
      throw new HError(605)
    }
    this._offset = value
    return this
  }

  /**
   * 设置排序依据
   * 
   * @param {string[]|string} key 字段名称
   * @return {this}
   */
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
    conditions.limit = this._limit === null ? constants.QUERY_LIMITATION_DEFAULT : this._limit
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

    conditions.where = JSON.stringify(this._queryObject)
    return conditions
  }
}

module.exports = BaseQuery
