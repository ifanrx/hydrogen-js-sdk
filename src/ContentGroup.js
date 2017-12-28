const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const baasRequest = require('./baasRequest').baasRequest

class ContentGroup extends BaseQuery {
  constructor(contentGroupID) {
    super()
    this._contentGroupID = contentGroupID
  }

  get(richTextID) {
    return BaaS.getContent({richTextID})
  }

  find() {
    return BaaS.getContentList(this._handleAllQueryConditions())
  }

  getCategoryList() {
    return BaaS.getContentCategoryList({contentGroupID})
  }

  getCategory(categoryID) {
    return BaaS.getContentCategory({categoryID})
  }
}

module.exports = ContentGroup