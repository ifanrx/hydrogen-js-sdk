const constants = require('core-module/constants')
const PopupWindow = require('./PopupWindow')
const PopupIframe = require('./PopupIframe')
const RedirectWindow = require('./RedirectWindow')

const productMap = {
  [constants.THIRD_PARTY_AUTH_MODE.POPUP_IFRAME]: PopupIframe,
  [constants.THIRD_PARTY_AUTH_MODE.POPUP_WINDOW]: PopupWindow,
  [constants.THIRD_PARTY_AUTH_MODE.REDIRECT]: RedirectWindow,
}

module.exports = {
  create: (mode, options) => {
    let Product = productMap[mode]
    if (!Product) Product = PopupWindow
    return new Product(options)
  }
}
