const config = require('./config')

let devConfig = {
  DEBUG: true,
}

module.exports = Object.assign(config, devConfig)