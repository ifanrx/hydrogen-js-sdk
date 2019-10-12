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
   * @return {Promise<BaaS.Response<any>>}
   */
  getFileList(categoryID) {
    let query = new Query()
    query.in('category_id', [categoryID])
    return BaaS.getFileList({where: JSON.stringify(query.queryObject)})
  }

  /**
   * 获取文件分类列表。
   * @method
   * @return {Promise<BaaS.Response<any>>}
   */
  find() {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.getFileCategoryList(condition)
  }
}

module.exports = FileCategory
