const utils = require('core-module/utils')
const constants = require('core-module/constants')
const getAuthModalElement = require('./getAuthModalElement')

class AuthIframe {
  constructor(options) {
    this.authPageUrl = options.authPageUrl
    this.provider = options.provider
    this.onClose = options.onClose
    this.authModalStyle = options.authModalStyle
    this.authModal = null
    this.handleCloseBtnClick = () => {
      if (typeof this.onClose === 'function') this.onClose()
      this.close()
    }
  }

  open() {
    this.authModal = getAuthModalElement(this.authModalStyle)
    const url = `${this.authPageUrl}?` +
      `provider=${encodeURIComponent(this.provider)}&` +
      `referer=${encodeURIComponent(window.location.href)}&` +
      `iframe=true`
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

module.exports = AuthIframe
