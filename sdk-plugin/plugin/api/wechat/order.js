const BaaS = require('../baas')
const utils = require('../utils')
const BaseQuery = require('../BaseQuery')

const API = BaaS._config.API

class Order extends BaseQuery {
  constructor() {
    super()
  }

  get(transactionID) {
    let url = utils.format(API.ORDER, {transactionID: transactionID})
    return BaaS._baasRequest({url})
  }

  getOrderList(params = {}) {
    let condition = Object.assign({}, this._handleAllQueryConditions(), params)
    this._initQueryParams()
    return BaaS.getOrderList(Object.assign(condition, params))
  }
}

Order.order = function (params) {
  let orderInst = new Order()
  return orderInst.get(params.transactionID)
}

module.exports = Order

