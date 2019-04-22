const defaultConfig = require('./copyFilesForDev.default')
let localConfig = []
let localConfigModulePath = './copyFilesForDev.local'

try {
  localConfig = require(localConfigModulePath)
} catch (err) {
  if (err.message !== `Cannot find module '${localConfigModulePath}'`) {
    throw err
  }
}

module.exports = [
  ...defaultConfig,
  ...localConfig,
]
