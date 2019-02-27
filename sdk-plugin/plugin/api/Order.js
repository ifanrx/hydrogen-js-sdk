const BaaS = require('./baas')
const utils = require('./utils')
const BaseQuery = require('./BaseQuery')

class Order extends BaseQuery {
  get(transactionID) {
    const API = BaaS._config.API
    let url = utils.format(API.ORDER, {transactionID: transactionID})
    return BaaS._baasRequest({url})
  }

  getOrderList(params = {}) {
    let condition = Object.assign({}, this._handleAllQueryConditions(), params)
    this._initQueryParams()
    return BaaS.getOrderList(Object.assign(condition, params))
  }
}

module.exports = Order
