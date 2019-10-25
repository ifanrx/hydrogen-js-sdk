const BaaS = require('core-module/baas')
const HError = require('core-module/HError')

const API = BaaS._config.API

const keysMap = {
  merchandiseSchemaID: 'merchandise_schema_id', // optional
  merchandiseRecordID: 'merchandise_record_id', // optional
  merchandiseSnapshot: 'merchandise_snapshot', // optional
  merchandiseDescription: 'merchandise_description', // required
  totalCost: 'total_cost', // required
}

/**
 * QQ 支付
 * @function
 * @name pay
 * @since v2.4.0
 * @memberof BaaS
 * @param {BaaS.PaymentParams} params 参数
 * @return {Promise<any>}
 */
const createPayFn = BaaS => params => {
  const API = BaaS._config.API
  let paramsObj = {}

  for (let key in params) {
    paramsObj[keysMap[key]] = params[key]
  }

  paramsObj.gateway_type = 'qpay'

  return BaaS._baasRequest({
    url: API.PAY,
    method: 'POST',
    data: paramsObj,
  }).then(function (res) {
    let data = res.data || {}
    return new Promise((resolve, reject) => {
      qq.requestPayment({
        package: data.package,
        success: function (res) {
          res.transaction_no = data.transaction_no
          res.trade_no = data.trade_no
          return resolve(res)
        },
        fail: function (err) {
          if (err.errMsg == 'requestPayment:fail 用户取消') {
            reject(new HError(607))
          } else {
            reject(new HError(608, err.errMsg))
          }
        },
      })
    })
  })
}

module.exports = function (BaaS) {
  BaaS.pay = createPayFn(BaaS)
}
