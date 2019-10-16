const HError = require('core-module/HError')

const keysMap = {
  merchandiseSchemaID: 'merchandise_schema_id', // optional
  merchandiseRecordID: 'merchandise_record_id', // optional
  merchandiseSnapshot: 'merchandise_snapshot', // optional
  merchandiseDescription: 'merchandise_description', // required
  totalCost: 'total_cost', // required
}

/**
 * 百度支付
 * @function
 * @name pay
 * @since v2.8.0
 * @memberof BaaS
 * @param {BaaS.PaymentParams} params 参数
 * @param {string[]} [bannedChannels] 需要隐藏的支付方式
 * @return {Promise<any>}
 */
const createPayFn = BaaS => (params, bannedChannels) => {
  const API = BaaS._config.API
  let paramsObj = {}

  for (let key in params) {
    paramsObj[keysMap[key]] = params[key]
  }

  paramsObj.gateway_type = 'baidu_miniapp_pay'

  return BaaS._baasRequest({
    url: API.PAY,
    method: 'POST',
    data: paramsObj,
  }).then(function (res) {
    let data = res.data || {}
    return new Promise((resolve, reject) => {
      swan.requestPolymerPayment({
        orderInfo: data,
        bannedChannels: bannedChannels || [],
        success: function (res) {
          // 百度 iOS 客户端 bug: res 为 string 类型，导致支付成功后，用户无法获取到 transaction_no
          if (typeof res === 'string') {
            res = {
              responseData: res,
            }
          }
          res.transaction_no = data.tpOrderId
          return resolve(res)
        },
        fail: function (err) {
          reject(new HError(608, err.errMsg))
        },
      })
    })
  })
}

module.exports = function (BaaS) {
  BaaS.pay = createPayFn(BaaS)
}
