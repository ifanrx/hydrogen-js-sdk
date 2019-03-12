const path = require('path')
const webpack = require('webpack')
const pkg = require('../package')
const isDEV = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const isCI = process.env.NODE_ENV === 'ci'
const CopyOutputFilePlugin = require('./webpack/CopyOutputFilePlugin')
const SdkPackPlugin = require('./webpack/SdkPackPlugin')
const fs = require('fs')

let plugins = [
  new webpack.DefinePlugin({
    __VERSION_WECHAT__: JSON.stringify(`v${(pkg.version)}`),
    __VERSION_WEB__: JSON.stringify(`v${(pkg.versions.web)}`),
    __VERSION_ALIPAY__: JSON.stringify(`v${(pkg.versions.alipay)}`),
  }),
]

if (isProd) {
  plugins = plugins.concat([
    // 生成 web sdk 最新版文件
    new CopyOutputFilePlugin({
      fileNameInOutputDir: `sdk-web.${pkg.versions.web}.js`,
      targetFileName: './sdk-web-latest.js',
    }),

    // 复制 web sdk 文件至测试目录
    new CopyOutputFilePlugin({
      fileNameInOutputDir: `sdk-web.${pkg.versions.web}.js`,
      targetFileName: '../../test/web/sdk.dev.js',
    }),

    // 复制 wechat-plugin sdk 文件至插件目录
    new CopyOutputFilePlugin({
      fileNameInOutputDir: `sdk-wechat-plugin.${pkg.version}.js`,
      targetFileName: '../../sdk-plugin/plugin/api/sdk-wechat.js',
    }),

    // 生成 zip 包等操作
    new SdkPackPlugin(),
  ])
} else {
  plugins = plugins.concat([
    // 复制 wechat-plugin sdk 文件至插件目录
    new CopyOutputFilePlugin({
      fileNameInOutputDir: 'sdk-wechat-plugin.dev.js',
      targetFileName: '../../sdk-plugin/plugin/api/sdk-wechat.js',
    }),

    // 复制 web sdk 文件至测试目录
    new CopyOutputFilePlugin({
      fileNameInOutputDir: 'sdk-web.dev.js',
      targetFileName: '../../test/web/sdk.dev.js',
    }),
  ])
}

module.exports = {
  context: __dirname,
  entry: {
    wechat: './src/wechat/index.js',
    'wechat-plugin': './src/wechat-plugin/index.js',
    alipay: './src/alipay/index.js',
    web: './src/web/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: isDEV || isCI ? 'sdk-[name].dev.js' : function (entry) {
      let version = pkg.versions[entry.chunk.name] || pkg.version
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
