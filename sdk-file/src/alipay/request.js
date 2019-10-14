const utils = require('core-module/utils')
const constants = require('core-module/constants')
const HError = require('core-module/HError')

class RequestError extends HError {
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
      return '未知错误'
    }
  }
}

const extractErrorMsg = (res) => {
  switch(res.status) {
  case constants.STATUS_CODE.NOT_FOUND:
    return 'not found'
  case constants.STATUS_CODE.UNAUTHORIZED:
    return 'unauthorized'
  default:
    // res.errorMessage 为 my.request 返回的错误信息
    return res.data.error_msg || res.data.message || res.errorMessage || ''
  }
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
      headers['X-Hydrogen-Request-Method'] = method
      method = 'POST'
    }
    if (!/https?:\/\//.test(url)) {
      const API_HOST = BaaS._polyfill.getAPIHost()
      url = API_HOST.replace(/\/$/, '') + '/' + url.replace(/^\//, '')
    }
    let requestFn = my.canIUse('request') ? my.request : my.httpRequest
    requestFn({
      method: method,
      url: url,
      data: data,
      headers,
      dataType,
      success: res => {
        res.statusCode = res.status
        resolve(res)
      },
      fail: res => {
        res.statusCode = res.status
        // 开发工具的 bug, 返回 200 才走 success
        if (res.status >= 200 && res.status < 300) {
          return resolve(res)
        }
        if (res.error == 19) {
          return reject(new HError(res.status, extractErrorMsg(res)))
        }
        reject(new RequestError(parseInt(res.error), res.errorMessage))
      }
    })
    utils.log(constants.LOG_LEVEL.INFO, 'Request => ' + url)
  })
}

module.exports = function (BaaS) {
  BaaS.request = createRequestFn(BaaS)
}

module.exports.RequestError = RequestError
module.exports.extractErrorMsg = extractErrorMsg
