const getIframeElem = require('./getIframeElem')

class Iframe {
  constructor(options) {
    this.authPageUrl = options.authPageUrl
    this.provider = options.provider
    this.window = this.open()
  }

  open() {
    const iframeElem = getIframeElem()
    iframeElem.src = `${this.authPageUrl}?` +
      `provider=${encodeURIComponent(this.provider)}&` +
      `source=${encodeURIComponent(window.location.href)}&` +
      `iframe=true`
    iframeElem.style.display = 'block'
    return iframeElem.contentWindow
  }

  close() {
    const iframeElem = getIframeElem()
    iframeElem.src = ''
    iframeElem.style.display = 'none'
  }
}

module.exports = Iframe
