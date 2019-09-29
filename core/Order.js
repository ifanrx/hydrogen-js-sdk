const BaaS = require('./baas')
const utils = require('./utils')
const BaseQuery = require('./BaseQuery')

/**
 * 支付订单
 * @memberof BaaS
 * @extends BaaS.BaseQuery
 * @public
 */
class Order extends BaseQuery {
  /**
   * 获取支付订单详情。
   * @method
   * @param {string} transactionID 支付流水 ID
   * @return {Promise<any>}
   */
  get(transactionID) {
    const API = BaaS._config.API
    let url = utils.format(API.ORDER, {transactionID: transactionID})
    return BaaS._baasRequest({url})
  }

  /**
   * @typedef GetOrderListParams
   * @property {string} merchandise_record_id 商品记录 ID，可用于定位用户购买的物品
   * @property {number} merchandise_schema_id 商品表 ID，可用于定位用户购买的物品
   * @property {'complete'|'pending'|'success'|'partial'} status 订单支付状态
   * @property {string} trade_no 真正的交易 ID, 业务方在服务方后台对账时可看到此字段
   * @property {string} transactionID 知晓云平台所记录的流水号
   * @property {string} gateway_type 支付方法，可选值有：weixin_tenpay（微信支付）、alipay（支付宝支付）等
   */

  /**
   * 获取支付订单列表。
   * @method
   * @param {GetOrderListParams} params 筛选参数
   * @return {Promise<any>}
   */
  getOrderList(params = {}) {
    let condition = Object.assign({}, this._handleAllQueryConditions(), params)
    this._initQueryParams()
    return BaaS.getOrderList(Object.assign(condition, params))
  }
}

module.exports = Order
