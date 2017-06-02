var extend = require('node.extend');
var config = require('./config');

var devConfig = {
  API_HOST: 'http://127.0.0.1:8000',
  DEBUG: true,
}

module.exports = extend(config, devConfig)