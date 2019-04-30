class Window {
  constructor(options) {
    this.authPageUrl = options.authPageUrl
    this.provider = options.provider
    this.window = this.open()
  }

  open() {
    return window.open(
      `${this.authPageUrl}?` +
      `provider=${encodeURIComponent(this.provider)}&` +
      `source=${encodeURIComponent(window.location.href)}&` +
      `iframe=false`
    )
  }

  close() {
    this.window.close()
  }
}

module.exports = Window
