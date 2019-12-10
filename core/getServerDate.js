const BaaS = require('./baas')
const API = BaaS._config.API

/**
 * @typedef ServerDate
 * @memberof BaaS
 * @property {string} time 服务器时间 （ISO 8601）
 */

/**
 * 获取服务器时间
 * @function
 * @name getServerDate
 * @memberof BaaS
 * @return {Promise<BaaS.Response<BaaS.ServerDate>>}
 */
module.exports = function getServerDate() {
  return BaaS._baasRequest({
    url: API.SERVER_TIME,
  })
}
