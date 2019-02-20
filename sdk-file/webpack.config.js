const path = require('path')
const webpack = require('webpack')
const pkg = require('../package')
const isDEV = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const isCI = process.env.NODE_ENV === 'ci'
const fs = require('fs')
var yazl = require("yazl");


let plugins = [
  new webpack.DefinePlugin({
    __VERSION_WEB__: JSON.stringify(`v${(pkg.versions.web)}`),
    __VERSION_ALIPAY__: JSON.stringify(`v${(pkg.versions.alipay)}`),
  }),
]

if (isProd) {
  plugins = plugins.concat({
      apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('ifanrxPackPlugin', (compilation, callback) => {
          let outputPath = compilation.options.output.path
          let promises = Object.keys(compilation.assets).map(asset => {
            return new Promise(resolve => {
              if (asset.match(/\.js$/)) {
                // 将 web sdk 命名为 sdk-web-latest.js
                if (asset.match(/-web.*\.js$/)) {
                  fs.writeFile(path.join(outputPath, 'sdk-web-latest.js'), compilation.assets[asset].children[0]._value, err => {
                    err && console.log(err)
                  })
                }

                // 生成 zip 包
                var zipfile = new yazl.ZipFile();
                zipfile.addFile(compilation.assets[asset].existsAt, asset);
                zipfile.outputStream.pipe(fs.createWriteStream(path.join(outputPath, asset.replace(/\.js$/, '.zip')))).on("close", resolve)
              }
            })
          })
          Promise.all(promises).then(callback)
        })
      }
    }
  )
}

module.exports = {
  context: __dirname,
  entry: {
    wechat: './src/wechat/index.js',
    alipay: './src/alipay/index.js',
    web: './src/web/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: isDEV || isCI ? 'sdk-[name].dev.js' : function (entry) {
      let version = pkg.versions[entry.name] || pkg.version
      return `sdk-[name].${version}.js`
    },
    library: 'BaaS',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        }
      }
    }]
  },
  plugins: plugins,
  resolve: {
    alias: {
      'core-module': path.resolve(__dirname, '../core/')
    }
  },
  devtool: isDEV ? 'inline-cheap-source-map' : 'source-map',
  mode: process.env.NODE_ENV
}
