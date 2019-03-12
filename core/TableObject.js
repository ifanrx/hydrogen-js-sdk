const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const HError = require('./HError')
const Query = require('./Query')
const TableRecord = require('./TableRecord')
const utils = require('./utils')
const BaseRecord = require('./BaseRecord')

class TableObject extends BaseQuery {
  constructor(tableID) {
    super()
    this._tableID = tableID
  }

  create() {
    return new TableRecord(this._tableID)
  }

  createMany(args, {enableTrigger = true} = {}) {
    const serializeValue = BaseRecord._serializeValueFuncFactory(['BaseRecord'])

    if (utils.isArray(args)) {
      const params = {
        tableID: this._tableID,
        data: args.map(record => {
          Object.keys(record).forEach(key => {
            record[key] = serializeValue(record[key])
          })
          return record
        }),
        enable_trigger: enableTrigger ? 1 : 0
      }
      return BaaS.createRecordList(params)
    } else {
      throw new HError(605)
    }
  }

  delete(args, {enableTrigger = true} = {}) {
    if (utils.isString(args) || Number.isInteger(args)) {
      return BaaS.deleteRecord({tableID: this._tableID, recordID: args})
    } else if (args instanceof Query) {
      const params = {
        tableID: this._tableID,
        limit: this._limit,
        offset: this._offset,
        where: JSON.stringify(args.queryObject),
        enable_trigger: enableTrigger ? 1 : 0
      }
      this._initQueryParams()
      return BaaS.deleteRecordList(params)
    } else {
      throw new HError(605)
    }
  }

  getWithoutData(args) {
    if (utils.isString(args) || Number.isInteger(args)) {
      return new TableRecord(this._tableID, args)
    } else if (args instanceof Query) {
      let queryObject = {}
      queryObject.limit = this._limit
      queryObject.offset = this._offset
      queryObject.where = utils.cloneDeep(args.queryObject)
      this._initQueryParams()
      return new TableRecord(this._tableID, null, queryObject)
    } else {
      throw new HError(605)
    }
  }

  get(recordID) {
    let params = {tableID: this._tableID, recordID}

    if (this._expand) {
      params.expand = this._expand
    }

    if (this._keys) {
      params.keys = this._keys
    }

    this._initQueryParams()

    return BaaS.getRecord(params)
  }

  _handleAllQueryConditions() {
    let condition = super._handleAllQueryConditions()
    condition.tableID = this._tableID
    return condition
  }

  find() {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.queryRecordList(condition)
  }

  count() {
    return this.limit(1).find().then(res => {
      let {total_count} = res.data.meta
      return total_count
    })
  }
}

module.exports = TableObject