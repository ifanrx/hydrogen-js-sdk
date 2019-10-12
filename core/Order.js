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
   * @return {Promise<BaaS.Response<any>>}
   */
  get(transactionID) {
    const API = BaaS._config.API
    let url = utils.format(API.ORDER, {transactionID: transactionID})
    return BaaS._baasRequest({url})
  }

  /**
   * 获取支付订单列表。
   * @method
   * @param {BaaS.GetOrderListParams} params 筛选参数
   * @return {Promise<BaaS.Response<any>>}
   */
  getOrderList(params = {}) {
    let condition = Object.assign({}, this._handleAllQueryConditions(), params)
    this._initQueryParams()
    return BaaS.getOrderList(Object.assign(condition, params))
  }
}

module.exports = Order
