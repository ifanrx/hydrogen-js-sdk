const HError = require('core-module/HError')
const utils = require('core-module/utils')
const constants = require('core-module/constants')

const appName = utils.getBytedanceAppName()

const keysMap = {
  merchandiseSchemaID: 'merchandise_schema_id', // optional
  merchandiseRecordID: 'merchandise_record_id', // optional
  merchandiseSnapshot: 'merchandise_snapshot', // optional
  merchandiseDescription: 'merchandise_description', // required
  totalCost: 'total_cost', // required
}

const SERVICE_ALIPAY = 'alipay'
const SERVICE_WECHAT = 'wechat'

const SERVICE_MAP = {
  [SERVICE_WECHAT]: 3,
  [SERVICE_ALIPAY]: 4,
}

const ORDER_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING: 'pending',
}

/**
 * 字节跳动支付
 * @function
 * @name pay
 * @since v3.11.0
 * @memberof BaaS
 * @param {BaaS.PaymentParams} params 参数
 * @param {string[]} [bannedChannels] 需要隐藏的支付方式
 * @return {Promise<any>}
 */
const createPayFn = BaaS => ({service, ...params}) => {
  const API = BaaS._config.API
  let paramsObj = {}

  for (let key in params) {
    paramsObj[keysMap[key]] = params[key]
  }

  paramsObj.gateway_type = 'bytedance_miniapp_pay'
  paramsObj.app_name = appName

  const serviceCode = SERVICE_MAP[service] || 1

  const getOrderStatus = ({out_order_no}) => {
    return new BaaS.Order()
      .get(out_order_no)
      .then(res => {
        if (res.data.status === ORDER_STATUS.SUCCESS) {
          utils.log(constants.LOG_LEVEL.DEBUG, `<payment>order status: ${res.data.status}`)
          return {code: 0}
        }
        if (res.data.status === ORDER_STATUS.FAILED) {
          utils.log(constants.LOG_LEVEL.DEBUG, `<payment>order status: ${res.data.status}`)
          return {code: 2}
        }
        utils.log(constants.LOG_LEVEL.DEBUG, `<payment>order status: ${res.data.status}`)
        return {code: 9}
      })
  }

  return BaaS._baasRequest({
    url: API.PAY,
    method: 'POST',
    data: paramsObj,
  }).then(function (res) {
    let data = res.data || {}
    return new Promise((resolve, reject) => {
      const makeResponse = code => {
        if (code != 0) return reject(new HError(608))
        return resolve({
          transaction_no: data.out_order_no,
        })
      }

      const options = {
        orderInfo: data,
        service: serviceCode,
        getOrderStatus,
        _debug: BaaS._config.LOG_LEVEL === constants.LOG_LEVEL.DEBUG ? 1 : 0,
        success (res) {
          utils.log(constants.LOG_LEVEL.DEBUG, `<payment> success handler ${JSON.stringify(res)}`)
          if (res.code == 4) {
            // 由于收银台选择支付宝支付，取消支付并跳回来时，会直接进入这里，并且 code == 4，
            // 收银台界面未关闭，用户可能会再次跳过去支付，此时不应该 resolve/reject 支付结果，所以直接 return
            if (serviceCode == 1) return
            return reject(new HError(607))
          }
          if (res.code == 9) {
            // 收银台支付时（选择支付宝支付），返回 code == 9，收银台未关闭，用户可以再次发起支付，
            // 此时不应该 resolve/reject 支付结果，所以直接 return
            if (serviceCode == 1) return
            // 微信支付（非收银台中选择的微信支付），从微信 app 中返回后，code 始终为 9，需要自己检查一下是否支付成功。
            return options.getOrderStatus({out_order_no: data.out_order_no}).then(res => {
              return makeResponse(res.code)
            })
          }
          return makeResponse(res.code)
        },
        fail (err) {
          utils.log(constants.LOG_LEVEL.DEBUG, `<payment> fail handler ${JSON.stringify(err)}`)
          reject(new HError(608, err.errMsg))
        },
      }
      tt.pay(options)
    })
  })
}

module.exports = function (BaaS) {
  BaaS.pay = createPayFn(BaaS)
}
