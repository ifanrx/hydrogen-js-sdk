const storage = require('./storage')
const constants = require('./constants')
const BaaS = require('./baas')
const HError = require('./HError')
const consoleLogLevel = require('console-log-level')

/**
 * log
 */
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


// 增加 includes polyfill，避免低版本的系统报错
// copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {

      if (this == null) {
        throw new TypeError('"this" is null or not defined')
      }

      // 1. Let O be ? ToObject(this value).
      let o = Object(this)

      // 2. Let len be ? ToLength(? Get(O, "length")).
      let len = o.length >>> 0

      // 3. If len is 0, return false.
      if (len === 0) {
        return false
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      let n = fromIndex | 0

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0)

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y))
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true
        }
        // c. Increase k by 1.
        k++
      }

      // 8. Return false
      return false
    }
  })
}

/**
 * 获取系统 Platform 信息
 * @return {String}
 */
const getSysPlatform = () => {
  let platform = 'UNKNOWN'
  try {
    let res = BaaS._polyfill.getSystemInfoSync()
    platform = res.platform
  } catch (e) {
    // pass for now
  }
  return platform
}

/**
 * 日志记录
 * @param  {String} level 级别
 * @param  {String} msg 日志信息
 */
const log = function (level, text) {
  logger[level] && logger[level](text)
}

/**
 * 转换 API 参数
 * @param  {String} url    API URL
 * @param  {Object} params API 参数
 * @return {String}        转换参数后的 API URL
 */
const format = (url, params) => {
  params = params || {}
  for (let key in params) {
    let reg = new RegExp(':' + key, 'g')
    url = url.replace(reg, encodeURIComponent(params[key]))
  }
  return url.replace(/([^:])\/\//g, (m, m1) => {
    return m1 + '/'
  })
}

const getFileNameFromPath = (path) => {
  let index = path.lastIndexOf('/')
  return path.slice(index + 1)
}

/**
 * 对 RegExp 类型的变量解析出不含左右斜杠和 flag 的正则字符串和 flags
 * @param  {RegExp} regExp
 * @return {Array} 包含正则字符串和 flags
 */
const parseRegExp = (regExp) => {
  let result = []
  let regExpString = regExp.toString()
  let lastIndex = regExpString.lastIndexOf('/')

  result.push(regExpString.substring(1, lastIndex))

  if (lastIndex !== regExpString.length - 1) {
    result.push(regExpString.substring(lastIndex + 1))
  }

  return result
}

/**
 * 将查询参数 (?categoryID=xxx) 替换为服务端可接受的格式 (?category_id=xxx) eg. categoryID => category_id
 */
const replaceQueryParams = (params = {}) => {
  let requestParamsMap = BaaS._config.REQUEST_PARAMS_MAP
  let copiedParams = Object.assign({}, params)

  Object.keys(params).map(key => {
    Object.keys(requestParamsMap).map(mapKey => {
      if (key.startsWith(mapKey)) {
        let newKey = key.replace(mapKey, requestParamsMap[mapKey])
        delete copiedParams[key]
        copiedParams[newKey] = params[key]
      }
    })
  })

  return copiedParams
}

const extractErrorMsg = (res) => {
  let errorMsg = ''
  if (res.statusCode === 404) {
    errorMsg = 'not found'
  } else if (res.data.error_msg) {
    errorMsg = res.data.error_msg
  } else if (res.data.message) {
    errorMsg = res.data.message
  }
  return errorMsg
}

const isString = value => {
  return Object.prototype.toString.call(value) === '[object String]'
}

const isArray = value => {
  return Object.prototype.toString.call(value) === '[object Array]'
}

const isObject = value => {
  const type = typeof value
  return value != null && (type == 'object')
}

const isFunction = value => {
  const type = typeof value
  return value != null && (type == 'function')
}

const extend = (...args) => {
  return Object.assign(...args)
}

// 目前仅支持对象或数字的拷贝
const cloneDeep = source => {
  if (source === undefined || source === null) return Object.create(null)
  const target = isArray(source) ? [] : Object.create(Object.getPrototypeOf(source))
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        target[keys] = isArray(source[keys]) ? [] : {}
        target[keys] = cloneDeep(source[keys])
      } else {
        target[keys] = source[keys]
      }
    }
  }
  return target
}

/**
 * session 是否已经过期，若不存在 EXPIRES_AT 缓存，则当做已过期
 * @return {boolean} expired
 */
function isSessionExpired() {
  return (Date.now() / 1000) >= (storage.get(constants.STORAGE_KEY.EXPIRES_AT) || 0)
}

/**
 * 把 URL 中的参数占位替换为真实数据，同时将这些数据从 params 中移除， params 的剩余参数传给 data eg. xxx/:tabelID/xxx => xxx/1001/xxx
 * @param  {Object} params 参数对象, 包含传给 url 的参数，也包含传给 data 的参数
 */
const excludeParams = (URL, params) => {
  URL.replace(/:(\w*)/g, (match, m1) => {
    if (params[m1] !== undefined) {
      delete params[m1]
    }
  })
  return params
}

/**
 * 根据 methodMap 创建对应的 BaaS Method
 * @param  {Object} methodMap 按照指定格式配置好的方法配置映射表
 */
const doCreateRequestMethod = (methodMap) => {
  for (let k in methodMap) {
    if (methodMap.hasOwnProperty(k)) {
      BaaS[k] = ((k) => {
        let methodItem = methodMap[k]
        return (objects) => {
          let newObjects = cloneDeep(objects)
          let method = methodItem.method || 'GET'

          if (methodItem.defaultParams) {
            let defaultParamsCopy = cloneDeep(methodItem.defaultParams)
            newObjects = Object.assign(defaultParamsCopy, newObjects)
          }

          // 替换 url 中的变量为用户输入的数据，如 tableID, recordID
          let url = format(methodItem.url, newObjects)

          let data = {}
          if (newObjects.data) {
            // 存在 data 属性的请求参数，只有 data 部分作为请求数据发送到后端接口
            data = newObjects.data
          } else {
            // 从用户输入的数据中，剔除 tableID, recordID 等用于 url 的数据
            data = excludeParams(methodItem.url, newObjects)

            // 将用户输入的数据中，部分变量名替换为后端可接受的名字，如 categoryID 替换为 category_id
            data = replaceQueryParams(data)
          }

          return BaaS._baasRequest({url, method, data})
        }
      })(k)
    }
  }
}

/**
 * 设置 BaaS.request 请求头
 * @param  {Object} header 自定义请求头
 * @return {Object}        扩展后的请求
 */
const mergeRequestHeader = header => {
  let extendHeader = {
    'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
    'X-Hydrogen-Client-Version': BaaS._config.VERSION,
    'X-Hydrogen-Client-Platform': BaaS._polyfill.CLIENT_PLATFORM,
    'X-Hydrogen-Client-SDK-Type': BaaS._polyfill.SDK_TYPE,
  }

  let authToken = BaaS.getAuthToken()
  if (authToken) {
    extendHeader['Authorization'] = BaaS._config.AUTH_PREFIX + ' ' + authToken
  }
  return Object.assign({}, header || {}, extendHeader)
}

/**
 * 处理 request.then 回调中出现 40x, 50x 的情况
 * @param res
 * @return {*}
 */
const validateStatusCode = res => {
  let status = parseInt(res.status || res.statusCode)
  if (status >= 200 && status < 300) {
    return res
  } else {
    throw new HError(status, extractErrorMsg(res))
  }
}


/**
 * 对于一个返回 promise 的函数，rateLimit 可以合并同一时间多次调用为单次调用
 * @param fn
 * @return {function(): *}
 */
const rateLimit = (fn) => {
  let promise = null
  return function () {
    if (!promise) {
      promise = fn.apply(this, arguments).then(res => {
        promise = null
        return res
      }, err => {
        promise = null
        throw err
      })
    }

    return promise
  }
}

const fnUnsupportedHandler = () => {
  throw new HError(611)
}

/**
 * 对比版本号
 * @param {string} versionStr1
 * @param {string} versionStr2
 * @return {number}
 * @description 若 versionStr1 大于 versionStr2，返回 1，小于 返回 -1，相等返回 0。
 * 注意该函数将会忽略 a(lpha)、b(eta) 等后缀,如 v2.0.0a 会被当做 2.0.0 处理
 */
const compareVersion = (versionStr1, versionStr2) => {
  try {
    if (typeof versionStr1 !== 'string' || typeof versionStr2 !== 'string') return 0

    // v1.1 ===> 1.1
    // ver2.2 ===> 2.2
    versionStr1 = versionStr1.replace(/^[^0-9]/, '')
    versionStr2 = versionStr2.replace(/^[^0-9]/, '')

    let versionArray1 = versionStr1.split('.')
    let versionArray2 = versionStr2.split('.')
    let len = Math.max(versionArray1.length, versionArray2.length)

    for (let i = 0; i < len; i++) {
      let num1 = versionArray1[i] ? parseInt(versionArray1[i]) : 0
      let num2 = versionArray2[i] ? parseInt(versionArray2[i]) : 0

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  } catch (e) {
    return 0
  }
}

const makeReportTicketParam = function (formID) {
  if (!formID) {
    throw new HError(605)
  }

  let paramsObj = {}
  paramsObj['submission_type'] = 'form_id'
  paramsObj['submission_value'] = formID
  return paramsObj
}

const getUpdateUserProfileParam = value => {
  let result
  Object.keys(constants.UPDATE_USERPROFILE_VALUE).forEach(key => {
    if (value === constants.UPDATE_USERPROFILE_VALUE[key]) {
      result = value
    }
  })
  if (!result) {
    result = constants.UPDATE_USERPROFILE_VALUE.SETNX
  }
  return result
}

const initReportTicketInvokeRecord = () => ({
  invokeTimes: 1,
  timestamp: Date.now(),
})
const isInvalidInvokeRecord = (invokeRecord) => {
  return isNaN(invokeRecord.invokeTimes) || isNaN(invokeRecord.timestamp)
}
let lastInvokeTime
const ticketReportThrottle = ticketReportFn => (...args) => {
  const {LOG_LEVEL, TICKET_REPORT_INVOKE_LIMIT, STORAGE_KEY} = constants
  const now = Date.now()
  log(LOG_LEVEL.DEBUG, `<ticket-report> last: ${lastInvokeTime}, now: ${now}`)
  if (lastInvokeTime && now - lastInvokeTime <= TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL) return Promise.resolve()  // 上次调用时间与当前时刻对比，未超过 5s 则调用失败

  let invokeRecord = storage.get(STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
  const isOverdue = invokeRecord && now - invokeRecord.timestamp > TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.CYCLE
  log(LOG_LEVEL.DEBUG, `<ticket-report> record: ${JSON.stringify(invokeRecord)}, now: ${now}`)
  if (invokeRecord && invokeRecord.invokeTimes >= TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE && !isOverdue) return Promise.resolve()  // 当调用次数超过 10 次，且第一次调用时间距离此刻未超过 24h，则调用失败

  // 更新 storage 中 REPORT_TICKET_INVOKE_RECORD 的数据
  if (!invokeRecord || isOverdue || isInvalidInvokeRecord(invokeRecord)) {
    invokeRecord = initReportTicketInvokeRecord()
  } else {
    invokeRecord.invokeTimes += 1
  }

  // 调用 ticket report 方法
  if (ticketReportFn && typeof ticketReportFn === 'function') {
    lastInvokeTime = now
    storage.set(STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, invokeRecord)
    log(LOG_LEVEL.DEBUG, '<ticket-report> invoke success')
    return ticketReportFn(...args).catch(err => {
      invokeRecord.invokeTimes -= 1
      storage.set(STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, invokeRecord)
      throw err
    })
  } else {
    log(LOG_LEVEL.DEBUG, '<ticket-report> invoke fail')
    log(LOG_LEVEL.ERROR, new TypeError('"ticketReportFn" must be Function type'))
  }
}

module.exports = {
  mergeRequestHeader,
  log,
  setLogLevel,
  format,
  getSysPlatform,
  getFileNameFromPath,
  parseRegExp,
  replaceQueryParams,
  extractErrorMsg,
  isArray,
  isString,
  isObject,
  isFunction,
  cloneDeep,
  isSessionExpired,
  excludeParams,
  doCreateRequestMethod,
  validateStatusCode,
  rateLimit,
  fnUnsupportedHandler,
  compareVersion,
  makeReportTicketParam,
  extend,
  getUpdateUserProfileParam,
  ticketReportThrottle,
}
