const path = require('path')
const fs = require('fs')

function Plugin({fileNameInOutputDir, to}) {
  this.fileName = fileNameInOutputDir
  this.to = to
}
Plugin.prototype.apply = function (compiler) {
  compiler.hooks.afterEmit.tapAsync('CopyOutputFilePlugin', (compilation, callback) => {
    let outputPath = compilation.options.output.path
    new Promise(resolve => {
      fs.writeFile(path.resolve(outputPath, this.to), compilation.assets[this.fileName].children[0]._value, err => {
        err && console.log(err)
        resolve()
      })
    }).then(() => callback())
  })
}
module.exports = Plugin
