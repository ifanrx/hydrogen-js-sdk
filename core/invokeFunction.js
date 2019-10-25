const BaaS = require('./baas')
const HError = require('./HError')
const API = BaaS._config.API

/**
 * 调用云函数
 * @name invoke
 * @function
 * @memberof BaaS
 * @param {string} functionName 云函数名称
 * @param {object} [params] 参数
 * @param {boolean} [sync] 是否同步运行
 * @return {Promise<any>}
 */
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

  return BaaS._baasRequest({
    url: API.CLOUD_FUNCTION,
    method: 'POST',
    data: data,
  }).then(res => {
    return res.data
  })
}

module.exports = invokeFunction
