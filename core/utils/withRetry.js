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
