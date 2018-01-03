const extend = require('node.extend')
const config = require('./config')

let devConfig = {
  DEBUG: true,
}

module.exports = extend(config, devConfig)