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

  find() {
    let condition = this._handleAllQueryConditions()
    condition.contentGroupID = this._contentGroupID
    this._initQueryParams()
    return BaaS.getContentList2(condition)
  }

  getCategoryList() {
    return BaaS.getContentCategoryList({contentGroupID: this._contentGroupID, limit: 100})
  }

  getCategory(categoryID) {
    let query = new Query()
    query.compare('group_id', '=', this._contentGroupID)
    return BaaS.getContentCategory({categoryID, where: JSON.stringify(query.queryObject)})
  }
}

module.exports = ContentGroup