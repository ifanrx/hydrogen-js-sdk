const HError = require('core-module/HError')
const utils = require('core-module/utils')
const constants = require('core-module/constants')

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

const RETRY_TIMES = 10 // 订单状态查询重试次数
const DELAY = 100 // 订单查询间隔时间

const createGetOrderStatusFn = (BaaS, data, promise) => {
  let times = RETRY_TIMES
  /*
   * 返回值详情请查看字节跳动文档 {@link @see https://microapp.bytedance.com/dev/cn/mini-app/develop/open-capacity/payment/tt.pay#getorderstatus}
   */
  const fn = () => new BaaS.Order()
    .get(data.transaction_no)
    .then(res => {
      if (res.data.status === ORDER_STATUS.SUCCESS) {
        utils.log(constants.LOG_LEVEL.DEBUG, `<payment>order status: ${res.data.status}`)
        promise.resolve(data)
        return 0
      }
      if (res.data.status === ORDER_STATUS.FAILED) {
        utils.log(constants.LOG_LEVEL.DEBUG, `<payment>order status: ${res.data.status}`)
        promise.reject(new HError(608))
        return 2
      }
      if (res.data.status === ORDER_STATUS.PENDING) {
        utils.log(constants.LOG_LEVEL.DEBUG, `<payment>order status: ${res.data.status}`)
        times -= 1
        if (times <= 0) {
          promise.reject(new HError(608))
          return 9
        }
        return new Promise(_resolve => setTimeout(_resolve, DELAY)).then(fn)
      } else {
        utils.log(constants.LOG_LEVEL.DEBUG, `<payment>order status: ${res.data.status}`)
        promise.reject(new HError(608))
        return 9
      }
    })
  return fn
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

  const serviceCode = SERVICE_MAP[service] || 1

  return BaaS._baasRequest({
    url: API.PAY,
    method: 'POST',
    data: paramsObj,
  }).then(function (res) {
    let data = res.data || {}
    return new Promise((resolve, reject) => {
      const options = {
        orderInfo: data,
        service: serviceCode,
        _debug: BaaS._config.LOG_LEVEL === constants.LOG_LEVEL.DEBUG ? 1 : 0,
        success: function (res) {
          if (res.code != 0) return reject(new HError(608))
          res.transaction_no = data.transaction_no
          res.trade_no = data.trade_no
          return resolve(res)
        },
        fail: function (err) {
          reject(new HError(608, err.errMsg))
        },
      }
      if (serviceCode == 1) {
        options.getOrderStatus = createGetOrderStatusFn(BaaS, {
          transaction_no: data.transaction_no,
          trade_no: data.trade_no,
        }, {resolve, reject})
      }
      tt.pay(options)
    })
  })
}

module.exports = function (BaaS) {
  BaaS.pay = createPayFn(BaaS)
}
