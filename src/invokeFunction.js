const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const HError = require('./HError')

const API = BaaS._config.API

const invokeFunction = (functionName, params, sync=true) => {
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

  return new Promise((resolve, reject) => {
    return baasRequest({
      url: API.CLOUD_FUNCTION,
      method: 'POST',
      data: data,
    }).then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

module.exports = invokeFunction