const pkg = require('../../package')
const isDEV = process.env.NODE_ENV === 'development'

module.exports = [
  {  // 复制 web sdk 文件至测试目录
    from: isDEV ? 'sdk-web.dev.js' : `sdk-web.${pkg.version}.js`,
    to: '../../test/web-dev-server/sdk.dev.js',
  },
  {  // 复制 wechat sdk 文件至测试目录
    from: isDEV ? 'sdk-react-native.dev.js' : `sdk-react-native.${pkg.version}.js`,
    to: path.resolve(process.env.HOME, './ifanr/hydrogen-js-sdk/react-native-minapp-sdk/sdk.js'),
  },
]
