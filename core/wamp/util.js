const GLOBAL_DEBUG = '__wamp_debug__'

const canUse = (prop) => {
  if (typeof global !== 'undefined') {
    return prop in global
  }
  if (typeof window !== 'undefined') {
    return prop in window
  }
  return false
}

function isDebug() {
  if (typeof global !== 'undefined' && GLOBAL_DEBUG in global) return true
  if (typeof window !== 'undefined' && GLOBAL_DEBUG in window) return true
  return false
}

const setDebug = (value = true) => {
  if (typeof global !== 'undefined') {
    global[GLOBAL_DEBUG] = value
    return
  }
  if (typeof window !== 'undefined') {
    window[GLOBAL_DEBUG] = value
    return
  }
}

const logger = (level) => (...args) => {
  console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}]`, ...args) // eslint-disable-line
}

const warn = logger('warn')

const _debug = logger('debug')
const debug = (...args) => {
  if (isDebug()) return _debug(...args)
}

const opt = (val, defaultVal) =>
  typeof val !== 'undefined' ? val : defaultVal

const rand_normal = (mean, sd) => {
  let x1, x2, rad

  do {
    x1 = 2 * Math.random() - 1
    x2 = 2 * Math.random() - 1
    rad = x1 * x1 + x2 * x2
  } while (rad >= 1 || rad == 0)

  let c = Math.sqrt((-2 * Math.log(rad)) / rad)

  return (mean || 0) + x1 * c * (sd || 1)
}

const handle_error = (handler, error, error_message) => {
  if (typeof handler === 'function') {
    handler(error, error_message)
  } else {
    console.error(error_message || 'unhandled exception raised: ', error) // eslint-disable-line
  }
}

const deferred_factory = () => () => {
  let deferred = {}

  deferred.promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve
    deferred.reject = reject
  })

  return deferred
}

const promisify = (fn) => (...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (error, result) => {
      if (error) {
        return reject(error)
      }
      return resolve(result)
    })
  })
}

const assert = (cond, text) => {
  if (cond) {
    return
  }
  if (isDebug()) {
    debugger // eslint-disable-line
  }

  throw new Error(text || 'Assertion failed!')
}

const is_object = (variable) => {
  return (
    !Array.isArray(variable) &&
    (variable instanceof Object || typeof variable === 'object')
  )
}

module.exports = {
  assert,
  canUse,
  debug,
  deferred_factory,
  handle_error,
  isDebug,
  is_object,
  opt,
  promisify,
  rand_normal,
  setDebug,
  warn,
}
