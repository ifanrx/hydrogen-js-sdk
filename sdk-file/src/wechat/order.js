const BaaS = require('core-module/baas')

/**
 * 获取支付订单
 * @function
 * @deprecated
 * @memberof BaaS
 * @param {BaaS.OrderParams} params 参数
 * @return {Promise<any>}
 */
const order = function (params) {
  let orderInst = new BaaS.Order()
  return orderInst.get(params.transactionID)
}

module.exports = order
