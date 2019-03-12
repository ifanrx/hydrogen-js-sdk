const path = require('path')
const fs = require('fs')
var yazl = require('yazl')

function Plugin() {}
Plugin.prototype.apply = function (compiler) {
  compiler.hooks.afterEmit.tapAsync('SdkPackPlugin', (compilation, callback) => {
    let outputPath = compilation.options.output.path
    let promises = Object.keys(compilation.assets).map(asset => {
      return new Promise(resolve => {
        if (asset.match(/\.js$/)) {
          // 生成 zip 包
          var zipfile = new yazl.ZipFile();
          zipfile.addFile(compilation.assets[asset].existsAt, asset);
          zipfile.outputStream.pipe(fs.createWriteStream(path.join(outputPath, asset.replace(/\.js$/, '.zip')))).on("close", resolve)
          zipfile.end()
        } else {
          resolve()
        }
      })
    })
    Promise.all(promises).then(() => callback())
  })
}
module.exports = Plugin
