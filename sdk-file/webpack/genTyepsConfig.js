const defaultConfig = require('./genTyepsConfig.default')
let localConfig = []
let localConfigModulePath = './genTyepsConfig.local'

try {
  localConfig = require(localConfigModulePath)
} catch (err) {
  if (err.message !== `Cannot find module '${localConfigModulePath}'`) {
    throw err
  }
}

module.exports = {
  ...defaultConfig,
  ...localConfig,
}
