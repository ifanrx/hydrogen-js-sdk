const utils = require('core-module/utils')
const HError = require('core-module/HError')
const constants = require('core-module/constants')
let thirdPartyAuthRequest = require('./thirdPartyAuthRequest')

// 获取授权结果
const createGetRedirectResultFn = BaaS => () => {
  const url = new URL(window.location.href)
  let authResult
  try {
    authResult = JSON.parse(url.searchParams.get(constants.THIRD_PARTY_AUTH_RESULT))
  } catch (e) {
    // pass
  }
  url.searchParams.delete(constants.THIRD_PARTY_AUTH_RESULT)
  if (!authResult) {
    return Promise.reject(new HError(613, 'auth result not found'))
  } else if (
    authResult.status === constants.THIRD_PARTY_AUTH_STATUS.SUCCESS
    && authResult.handler === constants.THIRD_PARTY_AUTH_HANDLER.LOGIN
  ) {
    history.replaceState && history.replaceState(null, '', url.toString())
    return BaaS.auth.getCurrentUser().then(user => {
      return {...authResult, user}
    })
  } else {
    history.replaceState && history.replaceState(null, '', url.toString())
    return Promise.resolve(authResult)
  }
}

let loginWithThirdPartyRequest = (BaaS, {provider, token, create_user, update_userprofile} = {}) => {
  return BaaS.request({
    url: utils.format(BaaS._config.API.WEB.THIRD_PARTY_LOGIN, {provider}),
    method: 'POST',
    data: {
      auth_token: token,
      create_user: !!create_user,
      update_userprofile: utils.getUpdateUserProfileParam(update_userprofile),
    }
  }).then(utils.validateStatusCode).then(res => {
    BaaS._polyfill.handleLoginSuccess(res)
  })
}

let linkThirdPartyRequest = (BaaS, {provider, token, update_userprofile} = {}) => {
  return BaaS.request({
    url: utils.format(BaaS._config.API.WEB.THIRD_PARTY_ASSOCIATE, {provider}),
    method: 'POST',
    data: {
      auth_token: token,
      update_userprofile: utils.getUpdateUserProfileParam(update_userprofile),
    }
  })
}

// 回传信息至调用页面
let sendMessage = (mode, referer, authResult) => {
  if (mode === constants.THIRD_PARTY_AUTH_MODE.REDIRECT) {
    const refererUrl = new URL(referer)
    refererUrl.searchParams.set(constants.THIRD_PARTY_AUTH_RESULT, JSON.stringify(authResult))
    window.location.href = refererUrl.toString()
  } else {
    const refererWindow = mode === constants.THIRD_PARTY_AUTH_MODE.POPUP_IFRAME
      ? window.parent
      : window.opener
    refererWindow.postMessage(authResult, referer)
  }
}

const getHandler = handler => {
  const handlerList = [
    constants.THIRD_PARTY_AUTH_HANDLER.LOGIN,
    constants.THIRD_PARTY_AUTH_HANDLER.ASSOCIATE,
  ]
  if (handlerList.indexOf(handler) === -1) {
    handler = handlerList[0]
  }
  return handler
}

const getErrorMsg = err => {
  let error = ''
  if (!err) return ''
  if (err.data && (err.data.error_msg || err.data.error_message)) {
    error = err.data.error_msg || err.data.error_message
  } else if (typeof err.data !== 'undefined') {
    error = err.data || err.statusText
  } else if (err.message) {   // error object
    error = err.message
  }
  return error
}

// 跳转到第三方授权页面；获取 token 后调用 login 或 associate
const createThirdPartyAuthFn = BaaS => () => {
  const params = new URLSearchParams(window.location.search)
  const accessToken = params.get('token')
  const provider = params.get('provider')
  const referer = params.get('referer')
  const mode = params.get('mode')
  const handler = getHandler(params.get('handler'))
  const create_user = params.get('create_user')
  const update_userprofile = params.get('update_userprofile')
  const request = handler === constants.THIRD_PARTY_AUTH_HANDLER.LOGIN
    ? loginWithThirdPartyRequest
    : linkThirdPartyRequest
  if (accessToken) {
    // 授权成功
    return request(BaaS, {provider, token: accessToken, create_user, update_userprofile})
      .then(() => {
        const authResult = {
          status: constants.THIRD_PARTY_AUTH_STATUS.SUCCESS,
          handler,
        }
        sendMessage(mode, referer, authResult)
      })
      .catch(err => {
        const error = getErrorMsg(err)
        const authResult = {
          status: constants.THIRD_PARTY_AUTH_STATUS.FAIL,
          error,
          handler,
        }
        sendMessage(mode, referer, authResult)
      })
  } else {
    // 跳转到第三方授权页面
    return BaaS.request({
      url: utils.format(BaaS._config.API.WEB.THIRD_PARTY_AUTH, {provider}),
      method: 'GET',
    }).then(res => {
      if (res.status === constants.STATUS_CODE.SUCCESS && res.data.status === 'ok') {
        window.location.href = res.data.redirect_url
      } else {
        throw res
      }
    }).catch(err => {
      const error = getErrorMsg(err)
      const authResult = {
        status: constants.THIRD_PARTY_AUTH_STATUS.FAIL,
        error,
        handler,
      }
      sendMessage(mode, referer, authResult)
      utils.log(constants.LOG_LEVEL.ERROR, err)
    })
  }
}

const createLoginWithThirdPartyFn = BaaS => (provider, authPageUrl, options = {}) => {
  return thirdPartyAuthRequest({...options, provider, authPageUrl, handler: constants.THIRD_PARTY_AUTH_HANDLER.LOGIN})
    .then(() => BaaS.auth.getCurrentUser())
}

module.exports = function (BaaS) {
  BaaS.auth.silentLogin = utils.fnUnsupportedHandler
  BaaS.auth.thirdPartyAuth = utils.rateLimit(createThirdPartyAuthFn(BaaS))
  BaaS.auth.loginWithThirdParty = utils.rateLimit(createLoginWithThirdPartyFn(BaaS))
  BaaS.auth.getRedirectResult = createGetRedirectResultFn(BaaS)
}
