const utils = require('core-module/utils')
const BaseQuery = require('core-module/BaseQuery')

function createOrderClass(BaaS) => class Order extends BaseQuery {
  get(transactionID) {
    const API = BaaS._config.API
    let url = utils.format(API.WECHAT.ORDER, {transactionID: transactionID})
    return BaaS._baasRequest({url})
  }

  getOrderList(params = {}) {
    let condition = Object.assign({}, this._handleAllQueryConditions(), params)
    this._initQueryParams()
    const API = BaaS._config.API
    return BaaS._baasRequest({
      url: API.ALIPAY.PAY,
      method: 'GET',
      data: Object.assign(condition, params)
    })
  }
}

module.exports = function (BaaS) {
  BaaS.Order = createOrderClass(BaaS)
}
