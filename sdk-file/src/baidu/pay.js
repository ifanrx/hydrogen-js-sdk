const HError = require('core-module/HError')

const keysMap = {
  merchandiseSchemaID: 'merchandise_schema_id', // optional
  merchandiseRecordID: 'merchandise_record_id', // optional
  merchandiseSnapshot: 'merchandise_snapshot', // optional
  merchandiseDescription: 'merchandise_description', // required
  totalCost: 'total_cost', // required
}

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
          res.transaction_no = data.transaction_no
          res.trade_no = data.trade_no
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
