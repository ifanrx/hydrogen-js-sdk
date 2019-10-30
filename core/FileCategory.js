const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const Query = require('./Query')

/**
 * 文件分类
 * @memberof BaaS
 * @extends BaaS.BaseQuery
 * @public
 */
class FileCategory extends BaseQuery {
  constructor() {
    super()
  }

  /**
   * 获取文件分类详情。
   * @method
   * @param {string} categoryID 文件分类 ID
   * @return {Promise<BaaS.Response<any>>}
   */
  get(categoryID) {
    return BaaS.getFileCategoryDetail({categoryID})
  }

  /**
   * 通过文件分类 ID 获取分类下的所有文件。
   * @method
   * @param {string} categoryID 文件分类 ID
   * @param {BaaS.FindOptions} [options] 参数
   * @return {Promise<BaaS.Response<any>>}
   */
  getFileList(categoryID, {withCount = false} = {}) {
    let query = new Query()
    query.in('category_id', [categoryID])
    return BaaS.getFileList({
      where: JSON.stringify(query.queryObject),
      return_total_count: withCount ? 1 : 0,
    })
  }

  /**
   * 获取文件分类列表。
   * @method
   * @param {BaaS.FindOptions} [options] 参数
   * @return {Promise<BaaS.Response<any>>}
   */
  find({withCount = false} = {}) {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.getFileCategoryList(Object.assign({}, condition, {
      return_total_count: withCount ? 1 : 0,
    }))
  }

  /**
   * 获取文件分类数量。
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
}

module.exports = FileCategory
