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

  find({withCount = false} = {}) {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.getFileCategoryList(Object.assign({}, condition, {
      return_total_count: withCount ? 1 : 0,
    }))
  }

  count() {
    return this.limit(1).find({withCount: true}).then(res => {
      let {total_count} = res.data.meta
      return total_count
    })
  }
}

module.exports = FileCategory
