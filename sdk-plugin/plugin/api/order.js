const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const utils = require('./utils')
const HError = require('./HError')
const BaseQuery = require('./BaseQuery')

const API = BaaS._config.API

class Order extends BaseQuery {
  constructor() {
    super()
  }

  get(transactionID) {
    let url = utils.format(API.ORDER, {transactionID: transactionID})
    return baasRequest({url})
  }

  getOrderList(params = {}) {
    let condition = this._handleAllQueryConditions()
    this._initQueryParams()

    let {merchandiseRecordID, merchandiseSchemaID} = params

    if (merchandiseRecordID) {
      condition.merchandise_record_id = merchandiseRecordID
    }

    if (merchandiseSchemaID) {
      condition.merchandise_schema_id = merchandiseSchemaID
    }

    return BaaS.getOrderList(condition)
  }
}

Order.order = function (params) {
  let orderInst = new Order()
  return orderInst.get(params.transactionID)
}

module.exports = Order

