const constants = require('../constants')
const consoleLogLevel = require('console-log-level')

const createLogger = function (level) {
  return consoleLogLevel({
    level,
  })
}
let logger = createLogger(constants.LOG_LEVEL.ERROR)
const setLogLevel = function (level) {
  Object.keys(constants.LOG_LEVEL).forEach(function (key) {
    if (constants.LOG_LEVEL[key] === level) {
      logger = createLogger(level)
    }
  })
}

/**
 * 日志记录
 * @param  {String} level 级别
 * @param  {String} msg 日志信息
 */
const log = function (level, text) {
  logger[level] && logger[level](text)
}

module.exports = {
  log,
  setLogLevel,
}
