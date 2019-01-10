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
      success: resolve,
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
