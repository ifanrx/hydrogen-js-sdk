const HError = require('core-module/HError')

const keysMap = {
  merchandiseSchemaID: 'merchandise_schema_id', // optional
  merchandiseRecordID: 'merchandise_record_id', // optional
  merchandiseSnapshot: 'merchandise_snapshot', // optional
  merchandiseDescription: 'merchandise_description', // required
  totalCost: 'total_cost', // required
}

const RESULT_CODE = {
  SUCCESS: '9000',
  PENDING: '8000',
  FAIL: '4000',
}

class PayError extends HError {
  mapErrorMessage(code) {
    code = code.toString()
    switch (code) {
    case RESULT_CODE.FAIL:
      return '订单支付失败'
    case '6001':
      return '用户中途取消'
    case '6002':
      return '网络连接出错'
    case '6004':
      return '支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态'
    case '99':
      return '用户点击忘记密码导致快捷界面退出' // only iOS
    default:
      return '未知错误'
    }
  }
}

/**
 * 支付宝支付
 * @function
 * @name pay
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

  paramsObj.gateway_type = 'alipay'

  return BaaS._baasRequest({
    url: API.PAY,
    method: 'POST',
    data: paramsObj,
  }).then(res => {
    const data = res.data || {}
    return new Promise((resolve, reject) => {
      my.tradePay({
        tradeNO: data.trade_no,
        success: res => {
          if (res.resultCode == RESULT_CODE.SUCCESS || res.resultCode == RESULT_CODE.PENDING) {
            res.transaction_no = data.transaction_no
            res.trade_no = data.trade_no
            return resolve(res)
          } else {
            return reject(new PayError(res.resultCode))
          }
        },
        fail: () => {
          return reject(new PayError(RESULT_CODE.FAIL))
        }
      })
    })
  })
}

module.exports = function (BaaS) {
  BaaS.pay = createPayFn(BaaS)
}
