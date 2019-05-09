const utils = require('core-module/utils')
const constants = require('core-module/constants')
let composeUrl = require('./composeUrl.js')

class PopupWindow {
  constructor(options) {
    this.options = options
    this.options.mode = constants.THIRD_PARTY_AUTH_MODE.POPUP_WINDOW
    this.timer = null
  }

  watchWindowStatus() {
    this.timer = setTimeout(() => {
      if (!this.window.closed) {
        this.watchWindowStatus()
      } else if (typeof this.options.onClose === 'function') {
        this.options.onClose()
        this.timer = null
      }
    }, 500)
  }

  open() {
    const url = composeUrl(this.options)
    utils.log(constants.LOG_LEVEL.DEBUG, `<third-party-auth> open window, url: "${url}"`)
    this.window = window.open(url, 'third party authorization', this.options.windowFeatures)
    this.watchWindowStatus()
  }

  close() {
    utils.log(constants.LOG_LEVEL.DEBUG, '<third-party-auth> close window')
    this.timer && clearTimeout(this.timer)
    this.window.close()
    this.window = null
  }
}

module.exports = PopupWindow
