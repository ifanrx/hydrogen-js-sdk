const baasRequest = require('./baasRequest').baasRequest
const BaaS = require('./baas')
const API = BaaS._config.API
const utils = require('./utils')
const Promise = require('./promise')

const order = (params) => {
  let url = utils.format(API.ORDER, { transactionID: params.transactionID })

  return baasRequest({
    url: url,
  }).then((res) => {
    return new Promise((resolve, reject) => {
      return resolve(res)
    }, (err) => {
      return reject(err)
    })
  }, (err) => {
    throw new Error(err)
  })
}

module.exports = order
