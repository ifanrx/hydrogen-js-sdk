const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const Query = require('./Query')

/**
 * 内容库
 * @memberof BaaS
 * @extends BaaS.BaseQuery
 * @public
 */
class ContentGroup extends BaseQuery {
  constructor(contentGroupID) {
    super()
    this._contentGroupID = contentGroupID
  }

  /**
   * 获取内容。
   * @method
   * @param {string} richTextID 内容 ID
   * @return {Promise<any>}
   */
  getContent(richTextID) {
    let params = {richTextID}
    if (this._expand) {
      params.expand = this._expand
    }

    if (this._keys) {
      params.keys = this._keys
    }
    this._initQueryParams()
    return BaaS.getContent(params)
  }

  /**
   * 查找内容。
   * @method
   * @return {Promise<any>}
   */
  find() {
    let condition = this._handleAllQueryConditions()
    condition.contentGroupID = this._contentGroupID
    this._initQueryParams()
    return BaaS.getContentList2(condition)
  }

  /**
   * 获取内容分类列表。
   * @method
   * @return {Promise<any>}
   */
  getCategoryList() {
    return BaaS.getContentCategoryList({contentGroupID: this._contentGroupID, limit: 100})
  }

  /**
   * 获取内容分类详情。
   * @method
   * @return {Promise<any>}
   */
  getCategory(categoryID) {
    let query = new Query()
    query.compare('group_id', '=', this._contentGroupID)
    return BaaS.getContentCategory({categoryID, where: JSON.stringify(query.queryObject)})
  }
}

module.exports = ContentGroup
