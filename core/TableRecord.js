const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const utils = require('./utils')

/**
 * 数据记录。
 * @memberof BaaS
 * @extends BaaS.BaseRecord
 * @package
 */
class TableRecord extends BaseRecord {
  /**
   * @param {string} tableName 数据表名
   * @param {string} recordID 数据记录 ID
   * @param {object} [queryObject] 查询对象
   */
  constructor(tableID, recordID, queryObject = {}) {
    super(recordID)
    this._tableID = tableID
    this._queryObject = queryObject
  }

  /**
   * 保存数据记录。
   * @return {Promise<BaaS.Response<any>>}
   */
  save() {
    let record = utils.cloneDeep(this._record)
    this._recordValueInit()
    return BaaS.createRecord({tableID: this._tableID, data: record.$set})
  }

  /**
   * 更新数据记录。
   * 批量更新时，如果不需要触发触发器，可以设置 options.enableTrigger 为 false
   * @param {BaaS.BatchUpdateParams} [options] 批量更新参数
   * @return {Promise<BaaS.Response<any>>}
   */
  update({enableTrigger = true} = {}) {
    let record = utils.cloneDeep(this._record)
    this._recordValueInit()
    if (this._recordID) {
      return BaaS.updateRecord({tableID: this._tableID, recordID: this._recordID, data: record})
    } else {
      const params = {
        tableID: this._tableID,
        data: record,
        where: JSON.stringify(this._queryObject.where),
        limit: utils.getLimitationWithEnableTigger(this._queryObject.limit, enableTrigger),
        offset: this._queryObject.offset,
        enable_trigger: enableTrigger ? 1 : 0
      }
      this._queryObject = {}
      return BaaS.updateRecordList(params)
    }
  }
}

module.exports = TableRecord
