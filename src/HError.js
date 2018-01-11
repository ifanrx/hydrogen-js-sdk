class HError {
  constructor(code, msg) {
    let error = new Error()

    error.code = code
    error.message = msg ? `${code}: ${msg}` : `${code}: ${this.mapErrorMessage(code)}`

    return error
  }

  // 前端错误信息定义
  mapErrorMessage(code) {
    switch (code) {
    case 600:
      return 'network disconnected'
    case 601:
      return 'request timeout'
    case 602:
      return 'uninitialized' // 未调用 BaaS.init()
    case 603:
      return 'unauthorized'  // 用户尚未授权
    case 604:
      return 'session missing' // 用户尚未登录
    case 605:
      return 'incorrect parameter type'
    case 607:
      return 'payment cancelled'
    case 608:
      return 'payment failed'   // error message 会被重写为微信返回的错误信息
    default:
      return 'unknown error'
    }
  }
}

module.exports = HError