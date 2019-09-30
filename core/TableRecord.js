const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const utils = require('./utils')

/**
 * 数据记录
 * @memberof BaaS
 * @extends BaaS.BaseRecord
 * @package
 */
class TableRecord extends BaseRecord {
  constructor(tableID, recordID, queryObject = {}) {
    super(recordID)
    this._tableID = tableID
    this._queryObject = queryObject
  }

  /**
   * 保存数据记录
   * @return {Promise<any>}
   */
  save() {
    let record = utils.cloneDeep(this._record)
    this._recordValueInit()
    return BaaS.createRecord({tableID: this._tableID, data: record.$set})
  }

  /**
   * 更新数据记录
   * @param {BaaS.BatchUpdateParams} [options] 批量更新参数
   * @return {Promise<any>}
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
        limit: this._queryObject.limit,
        offset: this._queryObject.offset,
        enable_trigger: enableTrigger ? 1 : 0
      }
      this._queryObject = {}
      return BaaS.updateRecordList(params)
    }
  }
}

module.exports = TableRecord
