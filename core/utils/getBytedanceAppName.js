module.exports = function getBytedanceAppName () {
  if (typeof tt === 'undefined') return ''
  const sysInfo = tt.getSystemInfoSync()
  return sysInfo.appName.toLowerCase()
}
