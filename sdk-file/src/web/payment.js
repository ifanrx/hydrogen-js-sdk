const HError = require('core-module/HError')

let WECHAT_GATEWAY_TYPE = {
  WAP: 'weixin_tenpay_wap',
  NATIVE: 'weixin_tenpay_native',
}

let ALIPAY_GATEWAY_TYPE = {
  WAP: 'alipay_wap',
  PAGE: 'alipay_page',
}

const pay = (BaaS, options) => {
  let API = BaaS._config.API
  return BaaS._baasRequest({
    url: API.PAY,
    method: 'POST',
    data: {
      gateway_type: options.gatewayType,
      total_cost: options.totalCost,
      merchandise_description: options.merchandiseDescription,
      merchandise_schema_id: options.merchandiseSchemaID,
      merchandise_record_id: options.merchandiseRecordID,
      merchandise_snapshot: options.merchandiseSnapshot,
    },
  })
}

const createPayWithWechatFn = BaaS => options => {
  if (!~[WECHAT_GATEWAY_TYPE.WAP, WECHAT_GATEWAY_TYPE.NATIVE].indexOf(options.gatewayType)) {
    return Promise.reject(new HError(608, 'incorrect gateway type'))
  }
  return pay(BaaS, options)
}

const createPayWithAlipayFn = BaaS => options => {
  if (!~[ALIPAY_GATEWAY_TYPE.WAP, ALIPAY_GATEWAY_TYPE.PAGE].indexOf(options.gatewayType)) {
    return Promise.reject(new HError(608, 'incorrect gateway type'))
  }
  return pay(BaaS, options)
}

module.exports = function (BaaS) {
  BaaS.payment = {
    payWithWechat: createPayWithWechatFn(BaaS),
    payWithAlipay: createPayWithAlipayFn(BaaS),
  }
}
