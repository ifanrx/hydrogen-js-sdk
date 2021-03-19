/**
 * 网络请求返回值
 * @typedef {object.<T>} Response<T>
 * @memberof BaaS
 * @property {object} header - HTTP Response Header
 * @property {T} data - 数据
 * @property {number} statusCode - HTTP 状态码
 */

/**
 * @typedef SubscribeMessageOptions
 * @memberof BaaS
 * @property {BaaS.Subscription[]} subscription 订阅关系
 */

/**
 * @typedef Subscription
 * @memberof BaaS
 * @property {string} template_id 模版 ID
 * @property {string} subscription_type 模版类型
 */