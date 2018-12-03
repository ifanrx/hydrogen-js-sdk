const HError = require('./HError')
const storage = require('./storage')
const constants = require('./constants')

let config
try {
  config = require('sdk-config')
} catch (e) {
  config = require('./config.dev')
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
      var o = Object(this)

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0

      // 3. If len is 0, return false.
      if (len === 0) {
        return false
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0)

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
 * 获取 SDK 配置信息
 * @return {Object}
 */
const getConfig = () => {
  return config
}

/**
 * 获取系统 Platform 信息
 * @return {String}
 */
const getSysPlatform = () => {
  let platform = 'UNKNOWN'
  try {
    let res = wx.getSystemInfoSync()
    platform = res.platform
  } catch (e) {
    // pass for now
  }
  return platform
}

/**
 * 日志记录
 * @param  {String} msg 日志信息
 */
const log = (msg) => {
  if (typeof BaaS !== 'undefined' && BaaS.test || !getConfig().DEBUG) { // 测试环境
    return
  }
  // 记录日志到日志文件
  console.log('BaaS LOG: ' + msg) // eslint-disable-line no-console
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
    url = url.replace(reg, params[key])
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
  let requestParamsMap = config.REQUEST_PARAMS_MAP
  let copiedParams = extend({}, params)

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

const wxRequestFail = (reject) => {
  wx.getNetworkType({
    success: function (res) {
      if (res.networkType === 'none') {
        reject(new HError(600)) // 断网
      } else {
        reject(new HError(601)) // 网络超时
      }
    }
  })
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

const extend = (dist, src) => {
  return Object.assign(dist, src)
}

// 目前仅支持对象或数字的拷贝
const cloneDeep = source => {
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
 * session 是否已经过期
 * @return {boolean} expired
 */
function isSessionExpired() {
  return Date.now() >= storage.get(constants.STORAGE_KEY.EXPIRED_AT)
}


module.exports = {
  log,
  format,
  getConfig,
  getSysPlatform,
  getFileNameFromPath,
  parseRegExp,
  replaceQueryParams,
  wxRequestFail,
  extractErrorMsg,
  isArray,
  isString,
  isObject,
  isFunction,
  extend,
  cloneDeep,
  isSessionExpired,
}
