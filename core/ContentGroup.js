const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const Query = require('./Query')

class ContentGroup extends BaseQuery {
  constructor(contentGroupID) {
    super()
    this._contentGroupID = contentGroupID
  }

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

  find({returnTotalCount = false} = {}) {
    let condition = this._handleAllQueryConditions()
    condition.contentGroupID = this._contentGroupID
    this._initQueryParams()
    return BaaS.getContentListV2(Object.assign({}, condition, {
      return_total_count: returnTotalCount ? 1 : 0,
    }))
  }

  getCategoryList({returnTotalCount = false} = {}) {
    return BaaS.getContentCategoryList({
      contentGroupID: this._contentGroupID,
      limit: 100,
      return_total_count: returnTotalCount ? 1 : 0,
    })
  }

  getCategory(categoryID) {
    let query = new Query()
    query.compare('group_id', '=', this._contentGroupID)
    return BaaS.getContentCategory({categoryID, where: JSON.stringify(query.queryObject)})
  }
}

module.exports = ContentGroup
