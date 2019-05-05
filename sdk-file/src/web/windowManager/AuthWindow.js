const utils = require('core-module/utils')
const constants = require('core-module/constants')

class AuthWindow {
  constructor(options) {
    this.authPageUrl = options.authPageUrl
    this.provider = options.provider
    this.onClose = options.onClose
    this.windowFeatures = options.windowFeatures
    this.timer = null
  }

  watchWindowStatus() {
    this.timer = setTimeout(() => {
      if (!this.window.closed) {
        this.watchWindowStatus()
      } else if (typeof this.onClose === 'function') {
        this.onClose()
      }
    }, 500)
  }

  open() {
    const url = `${this.authPageUrl}?` +
      `provider=${encodeURIComponent(this.provider)}&` +
      `referer=${encodeURIComponent(window.location.href)}&` +
      `iframe=false`
    utils.log(constants.LOG_LEVEL.DEBUG, `<third-party-auth> open window, url: "${url}"`)
    this.window = window.open(url, 'third party authorization', this.windowFeatures)
    this.watchWindowStatus()
  }

  close() {
    utils.log(constants.LOG_LEVEL.DEBUG, '<third-party-auth> close window')
    this.timer && clearTimeout(this.timer)
    this.window.close()
    this.window = null
  }
}

module.exports = AuthWindow
