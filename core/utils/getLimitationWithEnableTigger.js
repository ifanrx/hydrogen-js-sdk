const constants = require('../constants')

/*
 * @param {number} limit
 * @param {boolean} enableTrigger
 * @returns {number}
 */
module.exports = function getLimitationWithEnableTigger(limit, enableTrigger) {
  // 设置了 limit，直接返回
  if (limit !== null && typeof limit !== 'undefined') {
    return limit
  }

  // 如果触发触发器，则默认添加限制
  if (enableTrigger) {
    return constants.QUERY_LIMITATION_DEFAULT
  }

  // 不触发发触发器，则默认不限制
  return undefined
}
