/**
 * @typedef ThirdPartyLoginOptions
 * @memberof BaaS
 * @property {boolean} [createUser] 是否创建用户
 * @property {boolean} [syncUserProfile] 是否同步第一层级用户信息
 * @property {boolean} [debug] 是否开启 debug 模式
 * @property {string} [mode] 授权窗口打开模式
 * @property {Object} [authModalStyle] popup-iframe 模式下，授权模态框的样式
 * @property {Object} [wechatIframeContentStyle] 微信 web 授权，在 popup-iframe 模式下，微信授权页面的样式
 * @property {string} [windowFeatures] popup-window 模式下，授权窗口的特性，详见 {@link https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open}
 */

/**
 * @typedef RedirectLoginResult
 * @memberof BaaS
 * @property {string} status 状态。 'success' / 'fail'
 * @property {string} action 操作。'login'(第三方登录) / 'associate'(关联第三方账号)
 * @property {BaaS.UserRecord} user 当前用户对象，仅 status 为 'success' 且 action 为 'login' 时返回
 */

/**
 * 网络请求返回值
 * @typedef {object.<T>} Response<T>
 * @memberof BaaS
 * @property {object} headers - HTTP Response Header
 * @property {T} data - 数据
 * @property {number} statusCode - HTTP 状态码
 */

/**
 * 支付参数
 * @typedef WechatPaymentParams
 * @memberof BaaS
 * @property {string} merchandiseDescription 微信支付凭证-商品详情的内容
 * @property {number} totalCost 支付总额，单位：元
 * @property {string} [merchandiseSchemaID] 商品数据表 ID，可用于定位用户购买的物品
 * @property {string} [merchandiseRecordID] 商品数据行 ID，可用于定位用户购买的物品
 * @property {string} [merchandiseSnapshot] 根据业务需求自定义的数据
 * @property {string} [profitSharing] 当前订单是否需要分账
 */

/**
 * 支付参数
 * @typedef PaymentParams
 * @memberof BaaS
 * @property {string} merchandiseDescription 微信支付凭证-商品详情的内容
 * @property {number} totalCost 支付总额，单位：元
 * @property {string} [merchandiseSchemaID] 商品数据表 ID，可用于定位用户购买的物品
 * @property {string} [merchandiseRecordID] 商品数据行 ID，可用于定位用户购买的物品
 * @property {string} [merchandiseSnapshot] 根据业务需求自定义的数据
 */
