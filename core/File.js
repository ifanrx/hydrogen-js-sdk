const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const API = BaaS._config.API

/**
 * 文件
 * @memberof BaaS
 * @extends BaaS.BaseQuery
 * @public
 */
class File extends BaseQuery {
  constructor() {
    super()
  }

  /**
   * 上传文件。
   * @method
   * @param {BaaS.FileParams} fileParams 文件参数
   * @param {BaaS.FileMeta} metaData 文件元信息
   * @return {Promise<any>}
   */
  upload(fileParams, metaData) {
    return BaaS.uploadFile(fileParams, metaData, 'json')
  }

  /**
   * 删除文件。
   * @method
   * @param {string} id 文件 ID
   * @return {Promise<any>}
   */
  delete(id) {
    if(id instanceof Array) {
      return BaaS.deleteFiles({'id__in': id})
    } else {
      return BaaS.deleteFile({fileID: id})
    }
  }

  /**
   * 获取文件详情。
   * @method
   * @param {string} fileID 文件 ID
   * @return {Promise<any>}
   */
  get(fileID) {
    return BaaS.getFileDetail({fileID})
  }

  /**
   * 获取文件列表。
   * @method
   * @return {Promise<any>}
   */
  find() {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()
    return BaaS.getFileList(condition)
  }

  /**
   * 生成视频截图。
   * @method
   * @param {BaaS.VideoSnapshotParams} params 截图参数
   * @return {Promise<BaaS.FileOperationResult>}
   */
  genVideoSnapshot(params) {
    return BaaS._baasRequest({
      url: API.VIDEO_SNAPSHOT,
      method: 'POST',
      data: params,
    }).then(res => {
      return res.data
    })
  }

  /**
   * M3U8 视频拼接。
   * @method
   * @param {BaaS.VideoConcatParams} params 拼接参数
   * @return {Promise<BaaS.FileOperationResult>}
   */
  videoConcat(params) {
    return BaaS._baasRequest({
      url: API.M3U8_CONCAT,
      method: 'POST',
      data: params,
    }).then(res => {
      return res.data
    })
  }

  /**
   * M3U8 视频剪辑。
   * @method
   * @param {BaaS.VideoClipParams} params 剪辑参数
   * @return {Promise<BaaS.FileOperationResult>}
   */
  videoClip(params) {
    return BaaS._baasRequest({
      url: API.M3U8_CLIP,
      method: 'POST',
      data: params,
    }).then(res => {
      return res.data
    })
  }

  /**
   * M3U8 时长和分片信息。
   * @method
   * @param {BaaS.VideoMetaParams} params 分片信息参数
   * @return {Promise<BaaS.VideoMetaResult>}
   */
  videoMeta(params) {
    return BaaS._baasRequest({
      url: API.M3U8_META,
      method: 'POST',
      data: params,
    }).then(res => {
      return res.data
    })
  }

  /**
   * 音视频的元信息。
   * @method
   * @param {BaaS.VideoAudioMetaParams} params 音视频的元信息参数
   * @return {Promise<BaaS.VideoAudioMetaResult>}
   */
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
