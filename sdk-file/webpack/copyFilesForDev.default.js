const pkg = require('../../package')
const isDEV = process.env.NODE_ENV === 'development'

module.exports = [
  {  // 复制 web sdk 文件至测试目录
    from: isDEV ? 'sdk-web.dev.js' : `sdk-web.${pkg.versions.web}.js`,
    to: '../../test/web-dev-server/sdk.dev.js',
  },
]
