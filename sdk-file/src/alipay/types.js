
/**
 * 请求参数
 * @typedef AlipayRequestParams
 * @memberof BaaS
 * @property {string} url 请求的 URL
 * @property {string} [method] HTTP 请求方法，默认为 'GET'
 * @property {object} [data] 请求的参数
 * @property {object} [header] 请求的 header
 * @property {object} [headers] 请求的 header
 * @property {string} [dataType] 返回的数据格式
 */

/**
 * 网络请求返回值
 * @typedef {object.<T>} Response<T>
 * @memberof BaaS
 * @property {object} header - HTTP Response Header
 * @property {T} data - 数据
 * @property {number} statusCode - HTTP 状态码
 * @property {number} status - HTTP 状态码
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

/**
 * 获取二维码参数
 * @typedef AlipayQRCodeParams
 * @memberof BaaS
 * @property {string} urlParam 页面地址，最多 128 个字符
 * @property {string} queryParam 启动参数，最多 128 个字符
 * @property {string} describe 码描述，最少 2 个字符，最多 20 个字符
 */

/**
 * 获取二维码返回结果
 * @typedef AlipayQRCodeResult
 * @memberof BaaS
 * @property {string} image_url 二维码地址，二维码的下载链接
 */

/**
 * 支付宝登录参数
 * @typedef LoginWithAlipayParams
 * @memberof BaaS
 * @property {boolean} [forceLogin] 是否强制登录
 * @property {string[]} [scopes] 需要用户授权的 scope 列表
 * @property {boolean} [createUser] 是否创建用户
 * @property {boolean} [syncUserProfile] 是否同步第一层级用户信息
 */
