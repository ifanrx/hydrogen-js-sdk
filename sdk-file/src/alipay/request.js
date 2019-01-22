const utils = require('core-module/utils')
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

const createRequestFn = BaaS => ({url, method = 'GET', data = {}, header = {}, headers = {}, dataType = 'json'}) => {
  const config = BaaS._config
  return new Promise((resolve, reject) => {
    if (!config.CLIENT_ID) {
      return reject(new HError(602))
    }
    headers = utils.mergeRequestHeader(Object.assign({
      'Content-Type': 'application/json',
    }, header, headers))
    // 兼容 PUT 与 DELETE 请求，支付宝暂时只支持 GET 与 POST 两种请求
    if (method.toUpperCase() === 'PUT' || method.toUpperCase() === 'DELETE') {
      headers['X-Hydrogen-Alipay-Method'] = method
      method = 'POST'
    }
    if (!/https?:\/\//.test(url)) {
      url = config.API_HOST + url
    }
    my.httpRequest({
      method: method,
      url: url,
      data: data,
      headers,
      dataType,
      success: resolve,
      fail: res => {
        // 开发工具的 bug, 返回 200 才走 success
        if (res.status >= 200 && res.status < 300) {
          return resolve(res)
        }
        reject(new RequestError(parseInt(res.error), res.errorMessage))
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
