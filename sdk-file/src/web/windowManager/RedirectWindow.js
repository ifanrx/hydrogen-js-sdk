const utils = require('core-module/utils')
const constants = require('core-module/constants')
let composeUrl = require('./composeUrl.js')

class RedirectWindow {
  constructor(options) {
    this.options = options
    this.options.mode = constants.THIRD_PARTY_AUTH_MODE.REDIRECT
  }

  open() {
    const url = composeUrl(this.options)
    utils.log(constants.LOG_LEVEL.DEBUG, `<third-party-auth> redirect, url: "${url}"`)
    window.location.href = url
  }

  close() {}
}

module.exports = RedirectWindow
