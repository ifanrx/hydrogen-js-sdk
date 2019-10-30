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
  /**
   * @param {string} contentGroupID 内容库 ID
   */
  constructor(contentGroupID) {
    super()
    this._contentGroupID = contentGroupID
  }

  /**
   * 获取内容。
   * @method
   * @param {string} richTextID 内容 ID
   * @return {Promise<BaaS.Response<any>>}
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
   * @param {BaaS.FindOptions} [options] 参数
   * @return {Promise<BaaS.Response<any>>}
   */
  find({withCount = false} = {}) {
    let condition = this._handleAllQueryConditions()
    condition.contentGroupID = this._contentGroupID
    this._initQueryParams()
    return BaaS.getContentListV2(Object.assign({}, condition, {
      return_total_count: withCount ? 1 : 0,
    }))
  }

  /**
   * 获取内容数量。
   * @method
   * @since v3.0.0
   * @return {Promise<number>}
   */
  count() {
    return this.limit(1).find({withCount: true}).then(res => {
      let {total_count} = res.data.meta
      return total_count
    })
  }

  /**
   * 获取内容分类列表。
   * @method
   * @param {BaaS.FindOptions} [options] 参数
   * @return {Promise<BaaS.Response<any>>}
   */
  getCategoryList({withCount = false} = {}) {
    return BaaS.getContentCategoryList({
      contentGroupID: this._contentGroupID,
      limit: 100,
      return_total_count: withCount ? 1 : 0,
    })
  }

  /**
   * 获取内容分类详情。
   * @method
   * @return {Promise<BaaS.Response<any>>}
   */
  getCategory(categoryID) {
    let query = new Query()
    query.compare('group_id', '=', this._contentGroupID)
    return BaaS.getContentCategory({categoryID, where: JSON.stringify(query.queryObject)})
  }
}

module.exports = ContentGroup
