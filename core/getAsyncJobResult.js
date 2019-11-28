const BaaS = require('./baas')
const utils = require('./utils')
const API = BaaS._config.API

/**
 * 获取异步操作执行结果
 * @function
 * @name getAsyncJobResult
 * @memberof BaaS
 * @param {number} operationID 异步操作 ID
 * @return {Promise<BaaS.Response<any>>}
 */
module.exports = function getAsyncJobResult(id) {
  return BaaS._baasRequest({
    url: utils.format(API.GET_ASYNC_JOB_RESULT, {id}),
  })
}
