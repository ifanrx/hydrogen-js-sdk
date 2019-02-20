# 指南

config.js 结构如下
```javascript
const path = require('path')

module.exports = {
  user: 'xxxxx',
  password: 'xxxxxxxxx',
  host: 'ftp.xxxx.com',
  localRoot: path.join(__dirname, '../sdk-file/dist'),
  remoteRoot: '/hydrogen/sdk/',
  port: 21,
}
```