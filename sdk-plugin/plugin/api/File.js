const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const uploadFile = require('./uploadFile')

class File extends BaseQuery {
  constructor() {
    super()
  }

  upload(fileParams, metaData) {
    return uploadFile(fileParams, metaData, 'json')
  }

  delete(id) {
    if(id instanceof Array) {
      return BaaS.deleteFiles({'id__in': id})
    } else {
      return BaaS.deleteFile({fileID: id})
    }
  }

  get(fileID) {
    return BaaS.getFileDetail({fileID})
  }

  find() {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.getFileList(condition)
  }
}

module.exports = File