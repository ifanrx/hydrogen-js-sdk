const BaaS = require('./baas')
const BaseQuery = require('./BaseQuery')
const API = BaaS._config.API

/**
 * @typedef FileOperationResult
 * @memberof BaaS
 * @property {number} created_at 创建时间 （格式为 unix 时间戳)
 * @property {string} path 路径
 * @property {number} created_by 创建者 ID
 * @property {string} mime_type mime_type 类型
 * @property {string} media_type 媒体类型
 * @property {number} size 文件大小
 * @property {string} name 文件名
 * @property {string} status 文件状态
 * @property {string} reference 引用
 * @property {string} cdn_path cdn 中保存的路径
 * @property {number} updated_at Integer	更新时间 （格式为 unix 时间戳)
 * @property {string[]} categories 文件所属类别
 * @property {string} _id 本条记录 ID
 */

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
   * @typedef FileParams
   * @memberof BaaS
   * @property {string} [filePath] 本地资源路径（非 Web）
   * @property {object} [fileObj] 本地资源路径（Web）
   * @property {'image'|'video'|'audio'} [fileType] 本地资源路径（Alipay）
   */

  /**
   * @typedef FileMeta
   * @memberof BaaS
   * @property {string} categoryID 文件分类 ID
   * @property {string} categoryName 要上传的文件分类名
   */

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
   * @typedef VideoSnapshotParams
   * @memberof BaaS
   * @property {string} source 视频文件的 id
   * @property {string} save_as	截图保存的文件名
   * @property {string} point	截图时间格式，格式：HH:MM:SS
   * @property {string} [category_id]	文件所属类别 ID
   * @property {boolean} [random_file_link]	是否使用随机字符串作为文件的下载地址，不随机可能会覆盖之前的文件，默认为 true
   * @property {string} [size] 截图尺寸，格式为 宽 x 高，默认是视频尺寸
   * @property {string} [format] 截图格式，可选值为 jpg，png, webp, 默认根据 save_as 的后缀生成
   */

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
   * @typedef VideoConcatParams
   * @memberof BaaS
   * @property {string[]} m3u8s 视频文件的 id 列表，按提交的顺序进行拼接
   * @property {string} save_as	视频保存的文件名
   * @property {string} [category_id]	文件所属类别 ID
   * @property {boolean} [random_file_link]	是否使用随机字符串作为文件的下载地址，不随机可能会覆盖之前的文件，默认为 true
   */

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
   * @typedef VideoClipParams
   * @memberof BaaS
   * @property {string} m3u8s 视频文件的 id 列表，按提交的顺序进行拼接
   * @property {string} save_as	保存的文件名
   * @property {string} [category_id]	文件所属类别 ID
   * @property {boolean} [random_file_link]	是否使用随机字符串作为文件的下载地址，不随机可能会覆盖之前的文件，默认为 true
   * @property {string[]} [include]	包含某段内容的开始结束时间，单位是秒。当 index 为 false 时，为开始结束分片序号
   * @property {string[]} [exclude]	不包含某段内容的开始结束时间，单位是秒。当 index 为 false 时，为开始结束分片序号
   * @property {boolean} [index] include 或者 exclude 中的值是否为 ts 分片序号，默认为 false
   */

  /**
   * M3U8 视频剪辑。
   * @method
   * @param {BaaS.VideoClipParams} params 剪辑参数
   * @return {Promise<FileOperationResult>}
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
   * @typedef VideoMetaParams
   * @memberof BaaS
   * @property {string} m3u8s 视频文件的 id 列表，按提交的顺序进行拼接
   */

  /*
   * @typedef VideoMeta
   * @memberof BaaS
   * @property {number} duartion m3u8 时长
   * @property {number[]} points 时间点
   */

  /**
   * @typedef VideoMetaResult
   * @memberof BaaS
   * @property {number} status_code 状态码
   * @property {string} message 返回信息
   * @property {BaaS.VideoMeta} meta 元信息
   */

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
   * @typedef VideoAudioMetaParams
   * @property {string} source 文件的 ID
   */

  /**
   * @typedef VideoAudioMetaFormat
   * @property {number} bitrate 比特率
   * @property {number} duration 时长
   * @property {string} format 容器格式
   * @property {string} fullname 容器格式全称
   */

  /**
   * @typedef VideoAudioMetaStreams
   * @property {number} index 表示第几路流
   * @property {string} type 一般情况下, video 或 audio
   * @property {number} bitrate 流码率
   * @property {string} codec 流编码
   * @property {string} codec_desc 流编码说明
   * @property {number} duration 流时长
   * @property {number} video_fps (视频流)视频帧数
   * @property {number} video_height (视频流)视频高度
   * @property {number} video_width (视频流)视频宽度
   * @property {number} audio_channels (音频流)音频通道数
   * @property {number} audio_samplerate (音频流)音频采样率
   *
   */

  /**
   * @typedef VideoAudioMetaResult
   * @property {VideoAudioMetaFormat} format 音视频格式信息
   * @property {VideoAudioMetaStreams[]} streams stream 列表
   */

  /**
   * 音视频的元信息。
   * @method
   * @param {VideoAudioMetaParams} params 音视频的元信息参数
   * @return {Promise<VideoAudioMetaResult>}
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
