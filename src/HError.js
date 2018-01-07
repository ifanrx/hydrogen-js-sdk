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
      return 'network disconnect'
    case 601:
      return 'request timeout'
    case 602:
      return 'uncertificated'   // 在 storage 中未找到 token
    case 603:
      return 'unauthorization'  // 用户拒绝授权
    case 604:
      return 'not logged in'
    case 605:
      return 'incorrect parameter type'
    case 606:
      return 'uninitialized'
    case 607:
      return 'cancel the payment'
    case 608:
      return 'payment fail'   // error message 会被重写为微信返回的错误信息
    default:
      return 'unknow error'
    }
  }
}

module.exports = HError