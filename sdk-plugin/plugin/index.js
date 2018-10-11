const polyfill = require('./api/polyfill')
const utils = require('./api/utils')
const HError = require('./api/HError')
polyfill.getAPIHost = () => 'https://api.xiaoapp.io'
polyfill.SDK_TYPE = 'plugin'
polyfill.wxGetUserInfo = () => new HError(609)
polyfill.wxLogin = () => new HError(609)
polyfill.wxPaymentRequest = () => new HError(609)

const BaaS = require('./api/index')

BaaS.wxExtend = (...args) => {
  if (args.length < 1) {
    throw new HError(605)
  }

  if (utils.isObject(args[0])) {
    polyfill.wxLogin = args[0].wxLogin
    polyfill.wxGetUserInfo = args[0].wxGetUserInfo
    polyfill.wxPaymentRequest = args[0].wxPaymentRequest
  } else {
    const valiadFunc = ['wxLogin', 'wxGetUserInfo', 'wxPaymentRequest']
    let len = args.length > valiadFunc.length ? valiadFunc.length : args.length

    for (let i = 0; i < len; i++) {
      if (utils.isFunction(args[i])) {
        polyfill[valiadFunc[i]] = args[i]
      } else {
        throw new HError(605)
      }
    }
  }
}


module.exports = BaaS
