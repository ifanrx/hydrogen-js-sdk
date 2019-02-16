module.exports = {
  getAPIHost() {
    return `https://${require('./baas')._config.CLIENT_ID}.myminapp.com`
  },
  SDK_TYPE: 'file',
  CLIENT_PLATFORM: 'UNKNOWN',
}
