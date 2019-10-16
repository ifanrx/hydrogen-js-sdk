/**
 * 支付
 * @namespace payment
 * @memberof BaaS
 */

const HError = require('core-module/HError')
let utils = require('./utils')

let WECHAT_GATEWAY_PREFIX = 'weixin_tenpay_'

let WECHAT_GATEWAY_TYPE = {
  WAP: `${WECHAT_GATEWAY_PREFIX}wap`,
  NATIVE: `${WECHAT_GATEWAY_PREFIX}native`,
  JS_API: `${WECHAT_GATEWAY_PREFIX}js`,
}

let ALIPAY_GATEWAY_TYPE = {
  WAP: 'alipay_wap',
  PAGE: 'alipay_page',
}

let QQ_GATEWAY_TYPE = {
  NATIVE: 'qpay_native',
}

const pay = (BaaS, options) => {
  let API = BaaS._config.API
  let data = {
    gateway_type: options.gatewayType,
    total_cost: options.totalCost,
    merchandise_description: options.merchandiseDescription,
    merchandise_schema_id: options.merchandiseSchemaID,
    merchandise_record_id: options.merchandiseRecordID,
    merchandise_snapshot: options.merchandiseSnapshot,
  }
  if (options.gatewayType.startsWith(WECHAT_GATEWAY_PREFIX)) {
    data.profit_sharing = options.profitSharing
  }
  return BaaS._baasRequest({
    url: API.PAY,
    method: 'POST',
    data,
  })
}

/**
 * 微信支付
 * @function
 * @name payWithWechat
 * @since v2.2.0
 * @memberof BaaS.payment
 * @param {BaaS.WechatPaymentParams} params 参数
 * @return {Promise<any>}
 */
const createPayWithWechatFn = BaaS => options => {
  if (!~[WECHAT_GATEWAY_TYPE.WAP, WECHAT_GATEWAY_TYPE.NATIVE, WECHAT_GATEWAY_TYPE.JS_API].indexOf(options.gatewayType)) {
    return Promise.reject(new HError(608, 'incorrect gateway type'))
  }
  let requestPaymentConfig = pay(BaaS, options)
  // 非 JSAPI 支付
  if (options.gatewayType != WECHAT_GATEWAY_TYPE.JS_API) {
    return pay(BaaS, options)
  }
  // JSAPI 支付
  let tasks = [
    requestPaymentConfig.then(res => res.data).catch(err => {
      if (err.data) {
        return new Error(JSON.stringify(err.data))
      } else {
        return new Error(err.status + ' ' + err.statusText)
      }
    }),
    utils.getWeixinJSBridge().catch(() => new HError(615)),
  ]
  return Promise.all(tasks).then(result => {
    let [config, WeixinJSBridge] = result
    if (config instanceof Error || config instanceof HError) {
      return Promise.reject(config)
    }
    if (WeixinJSBridge instanceof Error || WeixinJSBridge instanceof HError) {
      return Promise.reject(WeixinJSBridge)
    }
    return new Promise((resolve, reject) => {
      WeixinJSBridge.invoke( 'getBrandWCPayRequest', config, res => {
        if(res.err_msg == 'get_brand_wcpay_request:ok' ){
          res.transaction_no = config.transaction_no
          res.trade_no = config.trade_no
          resolve(res)
        }
        if (res.err_msg == 'get_brand_wcpay_request:cancel') {
          reject(new HError(607))
        }
        reject(new HError(608, res.err_msg))
      })
    })
  })
}

/**
 * 支付宝支付
 * @function
 * @name payWithAlipay
 * @since v2.2.0
 * @memberof BaaS.payment
 * @param {BaaS.PaymentParams} params 参数
 * @return {Promise<any>}
 */
const createPayWithAlipayFn = BaaS => options => {
  if (!~[ALIPAY_GATEWAY_TYPE.WAP, ALIPAY_GATEWAY_TYPE.PAGE].indexOf(options.gatewayType)) {
    return Promise.reject(new HError(608, 'incorrect gateway type'))
  }
  return pay(BaaS, options)
}

/**
 * QQ 支付
 * @function
 * @name payWithQQ
 * @since v2.4.0
 * @memberof BaaS.payment
 * @param {BaaS.PaymentParams} params 参数
 * @return {Promise<any>}
 */
const createPayWithQQFn = BaaS => options => {
  if (options.gatewayType !== QQ_GATEWAY_TYPE.NATIVE) {
    return Promise.reject(new HError(608, 'incorrect gateway type'))
  }
  return pay(BaaS, options)
}

module.exports = function (BaaS) {
  BaaS.payment = {
    payWithWechat: createPayWithWechatFn(BaaS),
    payWithAlipay: createPayWithAlipayFn(BaaS),
    payWithQQ: createPayWithQQFn(BaaS),
  }
}
