const BaaS = require('./baas')
const BaseQuery = require('./baseQuery')

class FileCategory extends BaseQuery {
  constructor() {
    super()
  }

  get(directoryID) {
    return BaaS.getFileCategoryDetail({directoryID})
  }

  getFileList(directoryID) {
    return BaaS.getFileList({'id__in': directoryID})
  }

  find() {
    return BaaS.getFileCategoryList(this._handleAllQueryConditions())
  }
}

module.exports = FileCategory