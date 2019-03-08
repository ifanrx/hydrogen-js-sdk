const BaaS = require('../wechat/index')
const utils = require('core-module/utils')
const HError = require('core-module/HError')

BaaS._polyfill.getAPIHost = () => 'https://api.myminapp.com'
BaaS._polyfill.checkLatestVersion = () => null
BaaS._polyfill.SDK_TYPE = 'plugin'
BaaS._polyfill.wxGetUserInfo = () => new HError(609)
BaaS._polyfill.wxLogin = () => new HError(609)
BaaS._polyfill.wxPaymentRequest = () => new HError(609)

BaaS.wxExtend = (...args) => {
  if (args.length < 1) {
    throw new HError(605)
  }

  if (utils.isObject(args[0])) {
    BaaS._polyfill.wxLogin = args[0].wxLogin
    BaaS._polyfill.wxGetUserInfo = args[0].wxGetUserInfo
    BaaS._polyfill.wxPaymentRequest = args[0].wxPaymentRequest
  } else {
    const valiadFunc = ['wxLogin', 'wxGetUserInfo', 'wxPaymentRequest']
    let len = args.length > valiadFunc.length ? valiadFunc.length : args.length

    for (let i = 0; i < len; i++) {
      if (utils.isFunction(args[i])) {
        BaaS._polyfill[valiadFunc[i]] = args[i]
      } else {
        throw new HError(605)
      }
    }
  }
}


module.exports = BaaS
