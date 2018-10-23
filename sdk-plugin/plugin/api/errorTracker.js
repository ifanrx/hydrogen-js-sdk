const BaaS = require('./baas')
const HError = require('./HError')
const config = require('./config')
const polyfill = require('./polyfill')
const errorTracker = require('./vendor/bugOut.v1.1.0.min')

let initialized = false

function enable({usePlugins = false} = {}) {
  initialized = true
  if (!BaaS._config || !BaaS._config.CLIENT_ID) {
    throw new HError(602)
  }
  // 插件版强制设置为 true
  errorTracker.usePlugins = polyfill.SDK_TYPE === 'plugin' ? true : usePlugins
  return errorTracker.init(true, BaaS._config.CLIENT_ID, config.VERSION)
}

function track(...args) {
  if (!initialized) {
    throw new HError(610)
  }
  return errorTracker.track(...args)
}


module.exports = {
  enable, track
}