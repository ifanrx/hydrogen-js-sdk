const path = require('path')
const webpack = require('webpack')
const pkg = require('../package')
const isDEV = process.env.NODE_ENV === 'dev'

module.exports = {
  context: __dirname,
  entry: {
    wechat: './src/wechat/index.js',
    alipay: './src/alipay/index.js',
    web: './src/web/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: isDEV ? 'sdk-[name].dev.js' : function (entry) {
      let version = pkg.version
      if (entry.name === 'web') {
        version = pkg.versions.web
      } else if (entry.name === 'alipay') {
        version = pkg.versions.alipay
      }
      return `sdk-[name].${version}.js`
    },
    library: 'BaaS',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      __VERSION_WEB__: JSON.stringify(pkg.versions.web),
      __VERSION_ALIPAY__: JSON.stringify(pkg.versions.alipay),
    })
  ],
  resolve: {
    alias: {
      'core-module': path.resolve(__dirname, '../core/')
    }
  },
  devtool: isDEV ? 'inline-cheap-source-map' : 'source-map'
}
