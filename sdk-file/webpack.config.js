const path = require('path')

module.exports = {
  context: __dirname,
  entry: {
    wechat: './src/wechat/index.js',
    aliapy: './src/alipay/index.js',
    web: './src/web/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: process.env.NODE_ENV === 'dev' ? 'sdk-[name].dev.js' : 'sdk-[name].js',
    library: 'BaaS',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    alias: {
      'core-module': path.resolve(__dirname, '../core/')
    }
  }
}