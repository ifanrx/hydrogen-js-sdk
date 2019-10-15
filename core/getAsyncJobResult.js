const BaaS = require('./baas')
const utils = require('./utils')
const API = BaaS._config.API

module.exports = function getAsyncJobResult(id) {
  return BaaS._baasRequest({
    url: utils.format(API.GET_ASYNC_JOB_RESULT, {id}),
  })
}
