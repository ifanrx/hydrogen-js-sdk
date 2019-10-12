const BaaS = require('./baas')
const BaseRecord = require('./BaseRecord')
const utils = require('./utils')

/**
 * 当前用户
 * @memberof BaaS
 * @extends BaaS.BaseRecord
 * @package
 */
class UserRecord extends BaseRecord {
  /**
   * @param {string} userID 用户 ID
   */
  constructor(userID) {
    super(userID)
  }

  /**
   * 更新用户数据。
   * @method
   * @return {Promise<Response<any>>}
   */
  update() {
    let record = utils.cloneDeep(this._record)
    this._recordValueInit()
    return BaaS.updateUser({data: record.$set})
  }
}


/**
 * 创建一个 currentUser 对象
 * @private
 * @param userInfo
 */
UserRecord.initCurrentUser = function (userInfo) {
  let CurrentUser = require('./CurrentUser')
  return new CurrentUser(userInfo)
}

module.exports = UserRecord
