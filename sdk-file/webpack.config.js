const path = require('path')
const webpack = require('webpack')
const pkg = require('../package')
const isDEV = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const isCI = process.env.NODE_ENV === 'ci'
const JSZip = require('jszip')
const fs = require('fs')

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
          let promises = Object.keys(compilation.assets).map(asset => {
            return new Promise(resolve => {
              if (asset.match(/\.js$/)) {
                const zip = new JSZip()
                zip.file(asset, fs.readFileSync(compilation.assets[asset].existsAt))
                zip.generateNodeStream({type: 'nodebuffer', streamFiles: true})
                  .pipe(fs.createWriteStream(path.join(compilation.options.output.path, asset.replace(/\.js$/, '.zip'))))
                  .on('finish', resolve)
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
