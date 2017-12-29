const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const Query = require('./Query')

class ContentGroup extends BaseQuery {
  constructor(contentGroupID) {
    super()
    this._contentGroupID = contentGroupID
  }

  get(richTextID) {
    return BaaS.getContent({richTextID})
  }

  find() {
    let condition = this._handleAllQueryConditions()
    condition.contentGroupID = this._contentGroupID
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