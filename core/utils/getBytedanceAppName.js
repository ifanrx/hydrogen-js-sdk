const sysInfo = tt.getSystemInfoSync()

module.exports = function getBytedanceAppName() {
  return sysInfo.appName.toLowerCase()
}
