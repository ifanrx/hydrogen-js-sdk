// 默认取 window.WebSocket
let _WebSocket = null
if (typeof window !== 'undefined' && window.WebSocket) {
  _WebSocket = window.WebSocket
}

module.exports = {
  getAPIHost() {
    let BaaS = require('./baas')
    return BaaS._config.API_HOST || `https://${BaaS._config.CLIENT_ID}.myminapp.com`
  },
  SDK_TYPE: 'file',
  CLIENT_PLATFORM: 'UNKNOWN',
  checkLatestVersion() {
    return null
  },
  WebSocket: _WebSocket,
}
