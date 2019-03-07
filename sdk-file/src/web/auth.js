const storage = require('core-module/storage')
const utils = require('core-module/utils')
const constants = require('core-module/constants')

module.exports = function (BaaS) {
  BaaS.auth.silentLogin = utils.fnUnsupportedHandler
}
