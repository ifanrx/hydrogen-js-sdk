const BaaS = require('core-module/baas')
const HError = require('core-module/HError')
const config = BaaS._config
const polyfill = BaaS._polyfill
const bugOut = require('./vendor/bugOut.min')

let initialized = false

function enable({usePlugins = false} = {}) {
  if (!BaaS._config || !BaaS._config.CLIENT_ID) {
    throw new HError(602)
  }
  // 插件版强制设置为 true
  bugOut.usePlugins = polyfill.SDK_TYPE === 'plugin' ? true : usePlugins
  initialized = true
  return bugOut.init(true, {clientId: BaaS._config.CLIENT_ID}, config.VERSION)
}

function track(...args) {
  if (!initialized) {
    throw new HError(610)
  }
  return bugOut.track(...args)
}

function metaData(...args) {
  if (!initialized) {
    throw new HError(610)
  }

  return bugOut.metaData(...args)
}

module.exports = {
  enable, track, metaData,
}
