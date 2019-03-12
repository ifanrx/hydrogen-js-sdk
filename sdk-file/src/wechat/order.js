const BaaS = require('core-module/baas')

const order = function (params) {
  let orderInst = new BaaS.Order()
  return orderInst.get(params.transactionID)
}

module.exports = order

