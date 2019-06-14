const utils = require('core-module/utils')
const constants = require('core-module/constants')
const getAuthModalElement = require('./getAuthModalElement')
let composeUrl = require('./composeUrl.js')

class PopupIframe {
  constructor(options) {
    this.options = options
    this.authModal = null
    this.options.mode = constants.THIRD_PARTY_AUTH_MODE.POPUP_IFRAME
    this.handleCloseBtnClick = () => {
      if (typeof this.options.onClose === 'function') {
        this.options.onClose()
      }
      this.close()
    }
  }

  open() {
    this.authModal = getAuthModalElement(this.options.authModalStyle)
    const url = composeUrl(this.options)
    this.authModal.iframe.src = url
    utils.log(constants.LOG_LEVEL.DEBUG, `<third-party-auth> open iframe window, url: "${url}"`)
    this.authModal.container.style.display = 'block'
    this.authModal.closeBtn.addEventListener('click', this.handleCloseBtnClick, false)
  }

  close() {
    utils.log(constants.LOG_LEVEL.DEBUG, '<third-party-auth> close iframe window')
    this.authModal.closeBtn.removeEventListener('click', this.handleCloseBtnClick, false)
    this.authModal.iframe.src = ''
    this.authModal.container.style.display = 'none'
  }
}

module.exports = PopupIframe
