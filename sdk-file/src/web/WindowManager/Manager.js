const Window = require('./Window')
const Iframe = require('./Iframe')

class WindowManager {
  constructor(options) {
    if (options.iframe) {
      return new Iframe(options)
    } else {
      return new Window(options)
    }
  }
}

module.exports = WindowManager
