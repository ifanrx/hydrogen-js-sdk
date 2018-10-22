const BaaS = require('./baas')
const HError = require('./HError')
const config = require('./config')
const bugOut = require('./vendor/bugOut.v1.1.0.min')

let initialized = false

function enableBugOut({usePlugins = false} = {}) {
  initialized = true
  if (!BaaS._config || !BaaS._config.CLIENT_ID) {
    throw new HError(602)
  }
  bugOut.usePlugins = usePlugins
  return bugOut.init(true, BaaS._config.CLIENT_ID, config.BUG_OUT_VERSION)
}

function track(...args) {
  if (!initialized) {
    throw new HError(610)
  }
  return bugOut.track(...args)
}


module.exports = BaaS => {
  BaaS.enableBugOut = enableBugOut
  BaaS.track = track
}