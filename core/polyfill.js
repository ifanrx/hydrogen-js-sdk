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

  WebSocket: null,
  // TODO
  webSocketHost: 'ws://localhost:4000',
}
