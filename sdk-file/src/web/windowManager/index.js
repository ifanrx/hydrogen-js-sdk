const constants = require('core-module/constants')
const AuthWindow = require('./AuthWindow')
const AuthIframe = require('./AuthIframe')

const productMap = {
  [constants.AUTH_WINDOW_TYPE.IFRAME]: AuthIframe,
  [constants.AUTH_WINDOW_TYPE.WINDOW]: AuthWindow,
}

module.exports = {
  create: (type, options) => {
    let Product = productMap[type]
    if (!Product) Product = AuthWindow
    return new Product(options)
  }
}
