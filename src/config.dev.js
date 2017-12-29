var extend = require('node.extend')
var config = require('./config')

var devConfig = {
  DEBUG: true,
}

module.exports = extend(config, devConfig)