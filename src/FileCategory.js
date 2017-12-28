const BaaS = require('./baas')
const BaseQuery = require('./baseQuery')
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

  find() {
    return BaaS.getFileCategoryList(this._handleAllQueryConditions())
  }
}

module.exports = FileCategory