const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const API = BaaS._config.API

class File extends BaseQuery {
  constructor() {
    super()
  }

  upload(fileParams, metaData) {
    return BaaS.uploadFile(fileParams, metaData, 'json')
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

  find({withCount = false} = {}) {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.getFileList(Object.assign({}, condition, {
      return_total_count: withCount ? 1 : 0,
    }))
  }

  count() {
    return this.limit(1).find({withCount: true}).then(res => {
      let {total_count} = res.data.meta
      return total_count
    })
  }

  genVideoSnapshot(params) {
    return BaaS._baasRequest({
      url: API.VIDEO_SNAPSHOT,
      method: 'POST',
      data: params,
    }).then(res => {
      return res.data
    })
  }

  videoConcat(params) {
    return BaaS._baasRequest({
      url: API.M3U8_CONCAT,
      method: 'POST',
      data: params,
    }).then(res => {
      return res.data
    })
  }

  videoClip(params) {
    return BaaS._baasRequest({
      url: API.M3U8_CLIP,
      method: 'POST',
      data: params,
    }).then(res => {
      return res.data
    })
  }

  videoMeta(params) {
    return BaaS._baasRequest({
      url: API.M3U8_META,
      method: 'POST',
      data: params,
    }).then(res => {
      return res.data
    })
  }

  videoAudioMeta(params) {
    return BaaS._baasRequest({
      url: API.VIDEO_AUDIO_META,
      method: 'POST',
      data: params,
    }).then(res => {
      return res.data
    })
  }
}

module.exports = File
