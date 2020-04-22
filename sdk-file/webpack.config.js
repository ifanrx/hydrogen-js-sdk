const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const pkg = require('../package')
const isDEV = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const isCI = process.env.NODE_ENV === 'ci'
const CopyOutputFilePlugin = require('./webpack/CopyOutputFilePlugin')
const copyFilesForDev = require('./webpack/copyFilesForDev')
const shell = require('shelljs')
const exec = require('child_process').exec

let plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(`v${(pkg.version)}`),
    __VERSION_WECHAT__: JSON.stringify(`v${(pkg.version)}`),
    __VERSION_QQ__: JSON.stringify(`v${(pkg.version)}`),
    __VERSION_BAIDU__: JSON.stringify(`v${(pkg.version)}`),
    __VERSION_WEB__: JSON.stringify(`v${(pkg.version)}`),
    __VERSION_ALIPAY__: JSON.stringify(`v${(pkg.version)}`),
  }),

  ...copyFilesForDev.map(item => new CopyOutputFilePlugin({
    fileNameInOutputDir: item.from,
    targetFileName: item.to,
  })),

  // 复制 wechat-plugin sdk 文件至插件目录
  new CopyOutputFilePlugin({
    fileNameInOutputDir: isDEV ? 'sdk-wechat-plugin.dev.js' : `sdk-wechat-plugin.${pkg.version}.js`,
    targetFileName: '../../sdk-plugin/plugin/api/sdk-wechat.js',
  }),
  {
    apply: (compiler) => {
      compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
        let config = require('./webpack/genTyepsConfig')
        shell.exec(`scripts/gen-types.sh ${config.dest}`, {async:true})
      })
    }
  },
]

module.exports = {
  context: __dirname,
  entry: {
    wechat: './src/wechat/index.js',
    'wechat-plugin': './src/wechat-plugin/index.js',
    alipay: './src/alipay/index.js',
    web: './src/web/index.js',
    qq: './src/qq/index.js',
    baidu: './src/baidu/index.js',
    bytedance: './src/bytedance/index.js',
    'react-native': './src/react-native/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: isDEV || isCI ? 'sdk-[name].dev.js' : function (entry) {
      let version = pkg.version
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
  externals: ['@react-native-community/async-storage'],
  mode: process.env.NODE_ENV,
}
