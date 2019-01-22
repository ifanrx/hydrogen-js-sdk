const path = require('path')
const webpack = require('webpack')
const pkg = require('../package')
const isDEV = process.env.NODE_ENV === 'dev'
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
  plugins: [
    new webpack.DefinePlugin({
      __VERSION_WEB__: `v${JSON.stringify(pkg.versions.web)}`,
      __VERSION_ALIPAY__: `v${JSON.stringify(pkg.versions.alipay)}`,
    }),
    isDEV
      ? new CopyWebpackPlugin([{
        from: 'dist/sdk-wechat.dev.js',
        to: '../../tmp/vendor/sdk-wechat.dev.js'
      }])
      : new CopyWebpackPlugin([{
        from: `dist/sdk-wechat.${pkg.versions.web}.js`,
        to: '../../lib/web.js'
      }])
  ],
  resolve: {
    alias: {
      'core-module': path.resolve(__dirname, '../core/')
    }
  },
  devtool: isDEV ? 'inline-cheap-source-map' : 'source-map'
}
