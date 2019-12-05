const constants = require('../constants')
const log = require('./log').log

const shouldRetry = (err, matchMessage) => {
  if (!err) return false
  if (!matchMessage) return true
  if (Object.prototype.toString.call(matchMessage) === '[object RegExp]') {
    return matchMessage.test(err.message)
  }
  return err.message === matchMessage
}

/*
 * 如果 fn 抛出错误，则继续重试调用。
 * 重试次数不超过 maxCount - 1 次。
 * 如果不指定 matchMessage，则抛出任何错误都重试。
 * 如果指定了 matchMessage，则只重试特定的错误。
 *
 * @params {function} fn 需要重试的方法
 * @params {object} options 其他选项
 * @params {object} options.context 执行上下文
 * @params {number} options.maxCount 最大执行次数
 * @params {string|RegExp} options.matchMessage 错误信息匹配规则
 * @return {*} 返回调用 fn 的返回值
 */
const withRetry = (fn, { context, maxCount = 10, matchMessage } = {}) => (...args) => {
  let remaindCount = maxCount
  let retry = () => {
    const handleError = err => {
      if (shouldRetry(err, matchMessage) && remaindCount > 1) {
        log(constants.LOG_LEVEL.DEBUG, `<withRetry> "${fn.name}" called fail, remaindCount: ${remaindCount}, err: ${err}`)
        remaindCount -= 1
        return retry()
      } else {
        throw err
      }
    }
    try {
      const result = fn.apply(context, args)
      if (Object.prototype.toString.call(result) === '[object Promise]') {
        return result.catch(handleError)
      } else {
        return result
      }
    } catch (err) {
      return handleError(err)
    }
  }
  return retry()
}

module.exports = withRetry
