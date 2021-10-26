/**
 * 登录可选参数
 * @typedef {Object} WechatLoginOptions
 * @memberof BaaS
 * @property {boolean} [createUser] 是否创建用户
 * @property {boolean} [withUnionID] 是否使用 unionid 登录
 * @property {'overwrite'|'setnx'|'false'} [syncUserProfile]
 *   是否同步第一层级用户信息，默认为 'setnx'。值说明：
 *     'overwrite' - 强制更新
 *     'setnx' - 仅当字段从未被赋值时才更新
 *     'false' - 不更新
 */

/**
 * 网络请求返回值
 * @typedef {object.<T>} Response<T>
 * @memberof BaaS
 * @property {object} header - HTTP Response Header
 * @property {T} data - 数据
 * @property {number} statusCode - HTTP 状态码
 */

/**
 * 支付参数
 * @typedef PaymentParams
 * @memberof BaaS
 * @property {string} merchandiseDescription 微信支付凭证-商品详情的内容
 * @property {number} totalCost 支付总额，单位：元
 * @property {string} [merchandiseSchemaID] 商品数据表 ID，可用于定位用户购买的物品
 * @property {string} [merchandiseRecordID] 商品数据行 ID，可用于定位用户购买的物品
 * @property {Object} [merchandiseSnapshot] 根据业务需求自定义的数据
 * @property {boolean} [profitSharing] 当前订单是否需要分账
 */

/**
 * @typedef OrderParams
 * @memberof BaaS
 * @property {string} transactionID 支付流水号
 */

/**
 * @typedef Subscription
 * @memberof BaaS
 * @property {string} template_id 模版 ID
 * @property {string} subscription_type 模版类型
 */

/**
 * @typedef SubscribeMessageOptions
 * @memberof BaaS
 * @property {BaaS.Subscription[]} subscription 订阅关系
 */

/**
 * @typedef GetUserRiskRankOptions
 * @memberof BaaS
 * @property {number} scene 场景值，0:注册，1:营销作弊
 * @property {string} mobileNo 用户手机号
 * @property {string} emailAddress 用户邮箱地址
 * @property {string} extendedInfo 额外补充信息
 */

/**
 * 让插件帮助完成登录、支付等功能
 * @function
 * @memberof BaaS
 * @name wxExtend
 * @param {function} [login] 微信登录 wx.login
 * @param {function} [getUserInfo] 获取用户信息 wx.getUserInfo
 * @param {function} [requestPayment] 请求支付 wx.requestPayment
 */
