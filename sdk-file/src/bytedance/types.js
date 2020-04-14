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
 * @property {number} totalCost 支付总额，单位：分
 * @property {number} [service] 支付方式，1 为收银台支付，3 为微信 API 支付，4 为 支付宝 API 支付，默认为 1
 * @property {string} [merchandiseSchemaID] 商品数据表 ID，可用于定位用户购买的物品
 * @property {string} [merchandiseRecordID] 商品数据行 ID，可用于定位用户购买的物品
 * @property {object} [merchandiseSnapshot] 根据业务需求自定义的数据
 */
