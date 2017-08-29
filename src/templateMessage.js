const baasRequest = require('./baasRequest').baasRequest
const constants = require('./constants')
const BaaS = require('./baas')
const Promise = require('./promise')

const API = BaaS._config.API

function makeParams(...params) {
  if (!params || params.length !== 2) {
    throw new Error(constants.MSG.ARGS_ERROR)
  }

  if (params[0] !== 'form_id' && params[0] !== 'prepay_id') {
    throw new Error(constants.MSG.ARGS_ERROR)
  }

  var paramsObj = {}
  paramsObj['submission_type'] = params[0]
  paramsObj['submission_value'] = params[1]

  return paramsObj
}

const sendTemplateMessage = (params) => {
  var paramsObj = makeParams(params)

  return baasRequest({
    url: API.TEMPLATE_MESSAGE,
    method: 'POST',
    data: paramsObj,
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

module.exports = {
  makeParams,
  sendTemplateMessage
}