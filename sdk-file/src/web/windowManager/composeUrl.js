module.exports = function (options) {
  const url = new URL(options.authPageUrl, window.location.href)
  url.searchParams.append('provider', options.provider)
  url.searchParams.append('referer', window.location.href)
  url.searchParams.append('mode', options.mode)
  if (options.debug) {
    url.searchParams.append('debug', options.debug)
  }
  if (options.createUser) {
    url.searchParams.append('create_user', options.createUser)
  }
  if (options.syncUserProfile) {
    url.searchParams.append('update_userprofile', options.syncUserProfile)
  }
  url.searchParams.append('handler', options.handler)
  return url.toString()
}
