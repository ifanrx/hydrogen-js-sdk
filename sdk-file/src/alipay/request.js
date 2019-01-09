const utils = require('core-module/utils')
const constants = require('core-module/constants')
const HError = require('core-module/HError')

class RequestError {
  constructor(code, msg) {
    let error = new Error()
    error.code = code
    error.message = msg ? `${code}: ${msg}` : `${code}: ${this.mapErrorMessage(code)}`
    return error
  }

  // 前端错误信息定义
  mapErrorMessage(code) {
    switch (code) {
      case 11:
        return '无权跨域'
      case 12:
        return '网络出错'
      case 13:
        return '超时'
      case 14:
        return '解码失败'
      case 19:
        return 'HTTP 错误'
      default:
        return 'unknown error'
    }
  }
}

const extractErrorMsg = (res) => {
  let errorMsg = ''
  if (res.status === 404) {
    errorMsg = 'not found'
  } else if (res.data.error_msg) {
    errorMsg = res.data.error_msg
  } else if (res.data.message) {
    errorMsg = res.data.message
  }
  return errorMsg
}

/**
 *
 * @param {object} payload
 * @param resolve
 * @param reject
 */
function tryResendRequest(BaaS, payload, resolve, reject) {
  let silentLogin = BaaS.auth.silentLogin

  // 情景1：若是第一次出现 401 错误，此时的缓存一定是过期的。
  // 情景2：假设有 a,b 两个 401 错误的请求，a请求 300ms 后返回，走情景 1 的逻辑。b 在 pending 10 秒后返回，此时缓存实际上是没过期的，但是仍然会重新清空缓存，走情景 1 逻辑。
  // 情景3：假设有 a,b,c 3 个并发请求，a 先返回，走了情景 1 的逻辑，此时 bc 请求在 silentLogin 请求返回前返回了，这时候他们会等待 silentLogin , 即多个请求只会发送一次 silentLogin 请求
  if (BaaS.storage.get(constants.STORAGE_KEY.UID)) {
    // 缓存被清空，silentLogin 一定会发起 session init 请求
    BaaS.clearSession()
  }

  silentLogin().then(() => {
    my.httpRequest(
      Object.assign(payload,
        {
          headers: setHeader(BaaS, payload.header),
          success: resolve,
          fail: res => {
            reject(new RequestError(parseInt(res.status)))
          }
        }))
  }, reject)
}

/**
 * 设置请求头
 * @param  {Object} header 自定义请求头
 * @return {Object}        扩展后的请求
 */
const builtInHeader = ['X-Hydrogen-Client-ID', 'X-Hydrogen-Client-Version', 'X-Hydrogen-Client-Platform', 'Authorization']

const setHeader = (BaaS, header) => {
  const polyfill = BaaS._polyfill
  let extendHeader = {
    'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
    'X-Hydrogen-Client-Version': BaaS._config.VERSION,
    'X-Hydrogen-Client-Platform': utils.getSysPlatform(),  // TODO: platform 参数修改
    'X-Hydrogen-Client-SDK-Type': polyfill.SDK_TYPE,
  }

  let authToken = BaaS.getAuthToken()
  if (authToken) {
    extendHeader['Authorization'] = BaaS._config.AUTH_PREFIX + ' ' + authToken
  }

  if (header) {
    builtInHeader.map(key => {
      if (header.hasOwnProperty(key)) {
        delete header[key]
      }
    })
  }

  return utils.extend(extendHeader, header || {})
}

const createRequestFn = BaaS => ({url, method = 'GET', data = {}, header, headers, dataType = 'json'}) => {
  const config = BaaS._config
  headers = (!!headers ? headers : header) || {}
  return new Promise((resolve, reject) => {
    if (!config.CLIENT_ID) {
      return reject(new HError(602))
    }
    let headers = setHeader(BaaS, header)
    if (!/https?:\/\//.test(url)) {
      url = config.API_HOST + url
    }
    my.httpRequest({
      method: method,
      url: url,
      data: data,
      headers,
      dataType: dataType,
      success: res => {
        // 尝试重发请求
        if (res.statusCode == constants.STATUS_CODE.UNAUTHORIZED && url.match(config.API_HOST_PATTERN)) {
          return tryResendRequest(BaaS, {header, method, url, data, dataType}, resolve, reject)
        }
        resolve(res)
      },
      fail: res => {
        reject(new RequestError(parseInt(res.status)))
      }
    })

    utils.log('Request => ' + url)
  })
}

module.exports = function (BaaS) {
  BaaS.request = createRequestFn(BaaS)
}

module.exports.RequestError = RequestError
module.exports.extractErrorMsg = extractErrorMsg
