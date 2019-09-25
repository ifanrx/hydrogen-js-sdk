const constants = require('core-module/constants')
const PARAM = constants.THIRD_PARTY_AUTH_URL_PARAM

module.exports = function (options) {
  const url = new URL(options.authPageUrl, window.location.href)
  url.searchParams.set(PARAM.PROVIDER, options.provider)
  url.searchParams.set(PARAM.REFERER, window.location.href)
  url.searchParams.set(PARAM.MODE, options.mode)
  if (options.debug) {
    url.searchParams.set(PARAM.DEBUG, options.debug)
  }
  if (options.createUser || typeof options.createUser === 'undefined') {
    url.searchParams.set(PARAM.CREATE_USER, true)
  }
  if (options.syncUserProfile) {
    url.searchParams.set(PARAM.UPDATE_USER_PROFILE, options.syncUserProfile)
  }
  if (options.wechatIframeContentStyle) {
    url.searchParams.set(PARAM.WECHAT_IFRAME_CONTENT_STYLE, JSON.stringify(options.wechatIframeContentStyle))
  }
  url.searchParams.set(PARAM.HANDLER, options.handler)
  return url.toString()
}
