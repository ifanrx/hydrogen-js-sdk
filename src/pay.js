const baasRequest = require('./baasRequest').baasRequest
const BaaS = require('./baas')
const constants = require('./constants')
const Promise = require('./promise')
const storage = require('./storage')

const API = BaaS._config.API

/**
 * @description payment
 * @return {Promise} The result of the payment transaction, is a Promise object
 */
const keysMap = {
  merchandiseSchemaID: 'merchandise_schema_id', // optional
  merchandiseRecordID: 'merchandise_record_id', // optional
  merchandiseSnapshot: 'merchandise_snapshot', // optional
  merchandiseDescription: 'merchandise_description', // required
  totalCost: 'total_cost', // required
}

const pay = (params) => {
  if (!storage.get(constants.STORAGE_KEY.USERINFO)) {
    return new Promise((resolve, reject) => {
      reject(constants.MSG.UNAUTH_ERROR)
    })
  }

  var paramsObj = {}

  for (let key in params) {
    paramsObj[keysMap[key]] = params[key]
  }

  return baasRequest({
    url: API.PAY,
    method: 'POST',
    data: paramsObj,
  }).then(function (res) {
    var data = res.data || {}
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        appId: data.appId,
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: 'MD5',
        paySign: data.paySign,
        success: function (res) {
          res.transaction_no = data.transaction_no
          return resolve(res)
        },
        fail: function (err) {
          return reject(err)
        },
      })

    }, (err) => {
      throw new Error(err)
    })

  }, function (err) {
    throw new Error(err)
  })
}

module.exports = pay
