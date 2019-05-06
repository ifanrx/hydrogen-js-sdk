const utils = require('core-module/utils')
const HError = require('core-module/HError')
const constants = require('core-module/constants')
let getThirdPartyAuthToken = require('./getThirdPartyAuthToken')

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
    // 跳转到第三方授权页面
    return BaaS.request({
      url: utils.format(BaaS._config.API.WEB.THIRD_PARTY_AUTH, {provider}),
      method: 'GET',
    }).then(res => {
      if (res.status === 200 && res.data.status === 'ok') {
        window.location.href = res.data.redirect_url
      } else {
        throw res
      }
    }).catch(err => {
      let error = ''
      if (err.data) {
        error = err.statusText || err.data
      } else {
        error = err.message
      }
      refererWindow.postMessage({
        status: constants.THIRD_PARTY_AUTH_STATUS.FAIL,
        error,
      }, referer)
      throw err
    })
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
        return BaaS.auth.getCurrentUser()
      })
    })
}

module.exports = function (BaaS) {
  BaaS.auth.silentLogin = utils.fnUnsupportedHandler
  BaaS.auth.thirdPartyAuth = utils.rateLimit(createThirdPartyAuthFn(BaaS))
  BaaS.auth.loginWithThirdParty = utils.rateLimit(createLoginWithThirdPartyFn(BaaS))
}
