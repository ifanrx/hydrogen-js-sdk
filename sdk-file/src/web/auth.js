const utils = require('core-module/utils')
const HError = require('core-module/HError')
const constants = require('core-module/constants')
const getThirdPartyAuthToken = require('./getThirdPartyAuthToken')

const getToken = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('token')
}

const createThirdPartyAuthFn = BaaS => () => {
  const params = new URLSearchParams(window.location.search)
  const accessToken = params.get('token')
  const provider = params.get('provider')
  const referer = params.get('referer')
  const iframe = params.get('iframe')
  const refererWindow = iframe === 'true' ? window.parent : window.opener
  if (accessToken) {
    refererWindow.postMessage({
      status: constants.THIRD_PARTY_AUTH_STATUS.ACCESS_ALLOWED,
      token: accessToken,
    }, referer)
    return Promise.resolve()
  } else {
    // TODO: 跳转到正确的页面。
    window.location.href = 'http://viac2.eng-vm.can.corp.ifanr.com/login/partner/weixin/redirect/'
    // 跳转到第三方授权页面
    // return BaaS.request({
    //   // url: utils.format(BaaS._config.API.WEB.THIRD_PARTY_AUTH, {provider}),
    //   url: '/login/partner/weixin/redirect/',
    //   method: 'GET',
    // }).then(() => {
    //   #<{(|*
    //    * 请求成功返回后，页面会重定向。
    //    * 如果没有跳转到第三方授权页面，而继续往下执行了，
    //    * 则直接报“用户未授权”的错误。
    //    |)}>#
    //   throw new HError(603)
    // })
  }
}

// login
const createLoginWithThirdPartyFn = BaaS => (provider, authPageUrl, options = {}) => {
  const {createUser, syncUserProfile, ...otherOptions} = options
  return getThirdPartyAuthToken({...otherOptions, provider, authPageUrl})
    .then(token => {
      return BaaS.request({
        url: utils.format(BaaS._config.API.WEB.THIRD_PARTY_LOGIN, {provider}),
        method: 'POST',
        data: {
          token,
          create_user: createUser,
          update_userprofile: utils.getUpdateUserProfileParam(syncUserProfile),
        }
      }).then(utils.validateStatusCode).then(res => {
        BaaS._polyfill.handleLoginSuccess(res)
        return getCurrentUser()
      })
    })
}

module.exports = function (BaaS) {
  BaaS.auth.silentLogin = utils.fnUnsupportedHandler
  BaaS.auth.thirdPartyAuth = utils.rateLimit(createThirdPartyAuthFn(BaaS))
  BaaS.auth.loginWithThirdParty = utils.rateLimit(createLoginWithThirdPartyFn(BaaS))
}
