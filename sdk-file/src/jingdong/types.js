/**
 * 网络请求返回值
 * @typedef {object.<T>} Response<T>
 * @memberof BaaS
 * @property {object} header - HTTP Response Header
 * @property {T} data - 数据
 * @property {number} statusCode - HTTP 状态码
 */

/**
 * 登录可选参数
 * @typedef {Object} BytedanceLoginOptions
 * @memberof BaaS
 * @property {boolean} [forceLogin] 是否强制登录
 * @property {boolean} [createUser] 是否创建用户
 * @property {'overwrite'|'setnx'|'false'} [syncUserProfile]
 *   是否同步第一层级用户信息，默认为 'setnx'。值说明：
 *     'overwrite' - 强制更新
 *     'setnx' - 仅当字段从未被赋值时才更新
 *     'false' - 不更新
 */

/**
 * 支付参数
 * @typedef PaymentParams
 * @memberof BaaS
 * @property {string} merchandiseDescription 微信支付凭证-商品详情的内容
 * @property {number} totalCost 支付总额，单位：元
 * @property {number} [service] 支付方式，1 为收银台支付，3 为微信 API 支付，4 为 支付宝 API 支付，默认为 1
 * @property {string} [merchandiseSchemaID] 商品数据表 ID，可用于定位用户购买的物品
 * @property {string} [merchandiseRecordID] 商品数据行 ID，可用于定位用户购买的物品
 * @property {object} [merchandiseSnapshot] 根据业务需求自定义的数据
 */

/**
 * 获取二维码参数
 * @typedef BytedanceQRCodeParams
 * @memberof BaaS
 * @property {string} [path] 小程序/小游戏启动参数，小程序则格式为 <path>?<query>，小游戏则格式为 JSON 字符串，默认为空
 * @property {string} [platform] 当 `path` 字段指定时，该字段必填，取值: miniapp（小程序）/ minigame（小游戏）
 * @property {number} [width] 二维码宽度，单位 px，最小 280，最大 1280，默认为 430
 * @property {object} [line_color] 二维码线条颜色，默认为黑色，格式：{"r":0,"g":0,"b":0}
 * @property {object} [background] 二维码背景颜色，默认为透明，格式：{"r":0,"g":0,"b":0}
 * @property {boolean} [set_icon] 是否展示小程序/小游戏 icon，默认不展示
 * @property {string} [category_name] 二维码存储的分类名称
 * @property {number} [category_id] 二维码存储的分类 ID, 当名称、ID 同时存在时，ID 优先
 */
