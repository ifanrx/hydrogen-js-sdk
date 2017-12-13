const BaaS = require('./baas')
const BaseQuery = require('./baseQuery')
const baasRequest = require('./baasRequest').baasRequest
const uploadFile = require('./uploadFile')

class File extends BaseQuery {
  constructor() {
    super()
  }

  upload(fileParams, metaData) {
    return uploadFile(fileParams, metaData)
  }

  delete(id) {
    if(id instanceof Array) {
      return BaaS.deleteFile({'id__in': id.join(',')})
    } else {
      return BaaS.deleteFile({'id__in': id})
    }
  }

  get(fileID) {
    return BaaS.getFileDetail({fileID})
  }

  find() {
    return BaaS.getFileList(this._handleAllQueryConditions())
  }
}

module.exports = File