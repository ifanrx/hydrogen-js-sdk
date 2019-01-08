const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequestEnhance
const HError = require('./HError')

const API = BaaS._config.API

const invokeFunction = (functionName, params, sync = true) => {
  if (!functionName) {
    throw new HError(605)
  }

  let data = {
    function_name: functionName,
    sync,
  }

  if (params !== undefined) {
    data.data = params
  }

  return baasRequest({
    url: API.CLOUD_FUNCTION,
    method: 'POST',
    data: data,
  }).then(res => {
    resolve(res.data)
  })
}

module.exports = invokeFunction