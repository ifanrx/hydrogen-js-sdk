const BaaS = require('core-module/baas')
const HError = require('core-module/HError')
const polyfill = BaaS._polyfill

const API = BaaS._config.API


const keysMap = {
  merchandiseSchemaID: 'merchandise_schema_id', // optional
  merchandiseRecordID: 'merchandise_record_id', // optional
  merchandiseSnapshot: 'merchandise_snapshot', // optional
  profitSharing: 'profit_sharing', // optional
  merchandiseDescription: 'merchandise_description', // required
  totalCost: 'total_cost', // required
}

/**
 * @typedef PaymentParams
 * @property {string} merchandiseDescription 微信支付凭证-商品详情的内容
 * @property {number} totalCost 支付总额，单位：元
 * @property {string} [merchandiseSchemaID] 商品数据表 ID，可用于定位用户购买的物品
 * @property {string} [merchandiseRecordID] 商品数据行 ID，可用于定位用户购买的物品
 * @property {string} [merchandiseSnapshot] 根据业务需求自定义的数据
 * @property {string} [profitSharing] 当前订单是否需要分账
 */

/**
 * 微信支付
 * @function
 * @memberof BaaS
 * @param {PaymentParams} params 参数
 * @return {Promise<any>}
 */
const pay = (params) => {
  let paramsObj = {}

  for (let key in params) {
    paramsObj[keysMap[key]] = params[key]
  }

  paramsObj.gateway_type = 'weixin_tenpay'

  return BaaS._baasRequest({
    url: API.PAY,
    method: 'POST',
    data: paramsObj,
  }).then(function (res) {
    let data = res.data || {}
    return new Promise((resolve, reject) => {
      polyfill.wxPaymentRequest({
        appId: data.appId,
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: 'MD5',
        paySign: data.paySign,
        success: function (res) {
          res.transaction_no = data.transaction_no
          res.trade_no = data.trade_no
          return resolve(res)
        },
        complete: function (res) {
          // 兼容：微信 6.5.2 及之前版本中，用户取消支付不会触发 fail 回调，只会触发 complete 回调，回调 errMsg 为 'requestPayment:cancel'
          if (res.errMsg == 'requestPayment:fail cancel') {
            reject(new HError(607))
          }
        },
        fail: function (err) {
          // 微信不使用状态码来区分支付取消和支付失败，这里返回自定义状态码和微信的错误信息，便于用户判断和排错
          if (err.errMsg == 'requestPayment:fail cancel') {
            reject(new HError(607))
          } else {
            reject(new HError(608, err.errMsg))
          }
        },
      })
    })
  })
}

module.exports = pay
