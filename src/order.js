const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const utils = require('./utils')

const API = BaaS._config.API

const order = (params) => {
  let url = utils.format(API.ORDER, { transactionID: params.transactionID })

  return baasRequest({
    url: url,
  })
}

module.exports = order
