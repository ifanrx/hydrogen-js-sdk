/**
 * SDK 初始化选项
 * @typedef InitOptions
 * @memberof BaaS
 * @property {boolean} [autoLogin] - 是否自动登录
 * @property {string} [logLevel] - 日志输出等级
 * @property {string} [host] - 接口域名
 */

/**
 * 检测版本选项
 * @typedef CheckVersionOptions
 * @memberof BaaS
 * @property {string} platform - 需要检测的平台
 * @property {function} onSuccess - 接口请求成功时回调
 * @property {function} onError - 接口请求失败时的回调
 */

/**
 * 模块
 *
 * @typedef {Function} Module
 * @param {any} BaaS - BaaS 对象
 * @memberof BaaS
 */

/**
 * 登录/注册参数（用户名 + 密码）
 * @typedef AuthWithUsernameOptions
 * @memberof BaaS
 * @property username {string} 用户名
 * @property password {string} 密码
 */

/**
 * 登录/注册参数（邮箱 + 密码）
 * @typedef AuthWithEmailOptions
 * @memberof BaaS
 * @property email {string} 邮箱
 * @property password {string} 密码
 */

/**
 * 登录/注册参数（手机号码 + 密码）
 * @typedef AuthWithPhoneOptions
 * @memberof BaaS
 * @property phone {string} 手机号码
 * @property password {string} 密码
 */

/**
 * 登录可选参数
 * @typedef {Object} LoginOptions
 * @memberof BaaS
 * @property {boolean} [createUser] 是否创建用户
 * @property {'overwrite'|'setnx'|'false'} [syncUserProfile]
 *   是否同步第一层级用户信息，默认为 'setnx'。值说明：
 *     'overwrite' - 强制更新
 *     'setnx' - 仅当字段从未被赋值时才更新
 *     'false' - 不更新
 */

/**
 * 登录可选参数
 * @typedef {Object} handleUserInfoOptions
 * @memberof BaaS
 * @property {BaaS.UserInfoDetail} options.detail 用户信息
 * @property {boolean} [createUser] 是否创建用户
 * @property {'overwrite'|'setnx'|'false'} [syncUserProfile]
 *   是否同步第一层级用户信息，默认为 'setnx'。值说明：
 *     'overwrite' - 强制更新
 *     'setnx' - 仅当字段从未被赋值时才更新
 *     'false' - 不更新
 */

/**
 * 关联账号可选参数
 * @typedef {Object} LinkOptions
 * @memberof BaaS
 * @property {'overwrite'|'setnx'|'false'} [syncUserProfile]
 *   是否同步第一层级用户信息，默认为 'setnx'。值说明：
 *     'overwrite' - 强制更新
 *     'setnx' - 仅当字段从未被赋值时才更新
 *     'false' - 不更新
 */

/**
 * 用户信息
 * @typedef {Object} UserInfoDetail
 * @memberof BaaS
 * @property {Object} userInfo 用户信息对象，不包含 openid 等敏感信息
 * @property {string} rawData 不包括敏感信息的原始数据字符串，用于计算签名
 * @property {string} signature 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息
 * @property {string} encryptedData 包括敏感数据在内的完整用户信息的加密数据
 * @property {string} iv 加密算法的初始向量
 */

/**
 * 强制登录的授权参数
 * @typedef {Object} AuthData
 * @memberof BaaS
 * @property {BaaS.UserInfoDetail} detail 用户信息
 */

/**
 * 文件操作返回结果
 * @typedef {Object} FileOperationResult
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
 * 文件参数（文件上传）
 * @typedef FileParams
 * @memberof BaaS
 * @property {string} [filePath] 本地资源路径（非 Web）
 * @property {object} [fileObj] 本地资源路径（Web）
 * @property {'image'|'video'|'audio'} [fileType] 本地资源路径（Alipay）
 */

/**
 * 文件元信息（文件上传）
 * @typedef FileMeta
 * @memberof BaaS
 * @property {string} [categoryID] 文件分类 ID
 * @property {string} [categoryName] 要上传的文件分类名
 */

/**
 * 视频截图参数
 * @typedef VideoSnapshotParams
 * @memberof BaaS
 * @property {string} source 视频文件的 id
 * @property {string} save_as	截图保存的文件名
 * @property {string} point	截图时间格式，格式：HH:MM:SS
 * @property {string} [category_id]	文件所属类别 ID
 * @property {boolean} [random_file_link]	是否使用随机字符串作为文件的下载地址，不随机可能会覆盖之前的文件，默认为 true
 * @property {string} [size] 截图尺寸，格式为 宽 x 高，默认是视频尺寸
 * @property {string} [format] 截sf格式，可选值为 jpg，png, webp, 默认根据 save_as 的后缀生成
 */

/**
 * 视频拼接参数
 * @typedef VideoConcatParams
 * @memberof BaaS
 * @property {string[]} m3u8s 视频件的 id 列表，按提交的顺序进行拼接
 * @property {string} save_as	视频保存的文件名
 * @property {string} [category_id]	文件所属类别 ID
 * @property {boolean} [random_file_link]	是否使用随机字符串作为文件的下载地址，不随机可能会覆盖之前的文件，默认为 true
 */

/**
 * 视频剪辑参数
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
 * M3U8 时长和分片信息参数
 * @typedef VideoMetaParams
 * @memberof BaaS
 * @property {string} m3u8s 视频文件的 id 列表，按提交的顺序进行拼接
 */

/**
 * 视频元信息
 * @typedef VideoMeta
 * @memberof BaaS
 * @property {number} duartion m3u8 时长
 * @property {number[]} points 时间点
 */

/**
 * M3U8 时长和分片信息请求结果
 * @typedef VideoMetaResult
 * @memberof BaaS
 * @property {number} status_code 状态码
 * @property {string} message 返回信息
 * @property {BaaS.VideoMeta} meta 元信息
 */

/**
 * 音视频的元信息请求参数
 * @typedef VideoAudioMetaParams
 * @memberof BaaS
 * @property {string} source 文件的 ID
 */

/**
 * 音视频格式信息
 * @typedef VideoAudioMetaFormat
 * @memberof BaaS
 * @property {number} bitrate 比特率
 * @property {number} duration 时长
 * @property {string} format 容器格式
 * @property {string} fullname 容器格式全称
 */

/**
 * 音视频流
 * @typedef VideoAudioMetaStreams
 * @memberof BaaS
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
 */

/**
 * 音视频的元信息请求结果
 * @typedef VideoAudioMetaResult
 * @memberof BaaS
 * @property {BaaS.VideoAudioMetaFormat} format 音视频格式信息
 * @property {BaaS.VideoAudioMetaStreams[]} streams stream 列表
 */

/**
 * GeoJson
 * @typedef GeoJson
 * @memberof BaaS
 * @property {string} type 类型
 * @property {number[]} coordinates 坐标
 */

/**
 * 获取支付订单参数
 * @typedef GetOrderListParams
 * @memberof BaaS
 * @property {string} [merchandise_record_id] 商品记录 ID，可用于定位用户购买的物品
 * @property {string} [merchandise_schema_id] 商品表 ID，可用于定位用户购买的物品
 * @property {'complete'|'pending'|'success'|'partial'} [status] 订单支付状态
 * @property {string} [trade_no] 真正的交易 ID, 业务方在服务方后台对账时可看到此字段
 * @property {string} [transactionID] 知晓云平台所记录的流水号
 * @property {string} [gateway_type] 支付方法，可选值有：weixin_tenpay（微信支付）、alipay（支付宝支付）等
 */

/**
 * 批量创建参数
 * @typedef CreateManyParams
 * @memberof BaaS
 * @property {boolean} [enableTrigger] 是否触发触发器
 */

/**
 * 查询参数
 * @typedef FindOptions
 * @memberof BaaS
 * @property {boolean} [withCount] 是否返回 total_count
 */

/**
 * 批量更新参数
 * @typedef BatchUpdateParams
 * @memberof BaaS
 * @property {boolean} [enableTrigger] 是否触发触发器
 * @property {boolean} [withCount] 是否返回 total_count
 */

/**
 * 设置账号参数
 * @typedef SetAccountParmas
 * @memberof BaaS
 * @property {string|null} [username] 用户名
 * @property {string|null} [email] 邮箱
 * @property {string|null} [password] 密码
 */

/**
 * 更新密码
 * @typedef UpdatePasswordParams
 * @memberof BaaS
 * @property {string} password 旧密码
 * @property {string} newPassword 新密码
 */

/**
 * @typedef CensorAsyncResult
 * @memberof BaaS
 * @property {string} id 文件 ID
 * @property {string} [error_code] 错误码，=0 时不返回此字段
 * @property {string} [error_message] 错误信息，error_code=0 时不返回此字段
 * @property {number} status_code 默认为：0，4294966288(-1008)为链接无法下载
 * @property {boolean} risky 是否为违规内容，true 为风险，false 为未检测到风险，null 为微信尚未推送检查结果
 */

/**
 * 请求参数
 * @typedef RequestParams
 * @memberof BaaS
 * @property {string} url 请求的 URL
 * @property {string} [method] HTTP 请求方法，默认为 'GET'
 * @property {object} [data] 请求的参数
 * @property {object} [header] 请求的 header
 * @property {string} [dataType] 返回的数据格式
 */

/**
 * 关联支付宝账号参数
 * @typedef LinkAlipayParams
 * @memberof BaaS
 * @property {boolean} [forceLogin] 是否强制登录
 * @property {'overwrite'|'setnx'|'false'} [syncUserProfile]
 *   是否同步第一层级用户信息，默认为 'setnx'。值说明：
 *     'overwrite' - 强制更新
 *     'setnx' - 仅当字段从未被赋值时才更新
 *     'false' - 不更新
 */

/**
 * @typedef LinkThirdPartyParams
 * @memberof BaaS
 * @property {'overwrite'|'setnx'|'false'} [syncUserProfile]
 *   是否同步第一层级用户信息，默认为 'setnx'。值说明：
 *     'overwrite' - 强制更新
 *     'setnx' - 仅当字段从未被赋值时才更新
 *     'false' - 不更新
 * @property {boolean} [debug] 是否开启 debug 模式
 * @property {'popup-window'|'popup-iframe'|'redirect'} [mode] 授权窗口打开模式
 * @property {Object} [authModalStyle] popup-iframe 模式下，授权模态框的样式
 * @property {Object} [wechatIframeContentStyle] 微信 web 授权，在 popup-iframe 模式下，微信授权页面的样式
 * @property {string} [windowFeatures] popup-window 模式下，授权窗口的特性，详见 {@link https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open}
 */

/**
 * @typedef SetEmailOptions
 * @memberof BaaS
 * @property {boolean} sendVerificationEmail 是否发送验证邮件
 */

/**
 * @typedef PasswordResetParam
 * @memberof BaaS
 * @property {string} email email 地址
 */
