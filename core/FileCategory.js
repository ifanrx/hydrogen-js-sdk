const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const Query = require('./Query')

class FileCategory extends BaseQuery {
  constructor() {
    super()
  }

  get(categoryID) {
    return BaaS.getFileCategoryDetail({categoryID})
  }

  getFileList(categoryID) {
    let query = new Query()
    query.in('category_id', [categoryID])
    return BaaS.getFileList({where: JSON.stringify(query.queryObject)})
  }

  find({returnTotalCount = false} = {}) {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.getFileCategoryList(Object.assign({}, condition, {
      return_total_count: returnTotalCount ? 1 : 0,
    }))
  }
}

module.exports = FileCategory
