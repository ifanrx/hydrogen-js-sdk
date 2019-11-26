const utils = require('core-module/utils')
const HError = require('core-module/HError')
const constants = require('core-module/constants')
let thirdPartyAuthRequest = require('./thirdPartyAuthRequest')

/**
 * 获取授权结果
 * @function
 * @name getRedirectResult
 * @since v2.1.0
 * @memberof BaaS.auth
 * @return {Promise<BaaS.RedirectLoginResult>}
 */
const createGetRedirectResultFn = BaaS => () => {
  const url = new URL(window.location.href)
  let authResult
  try {
    authResult = JSON.parse(url.searchParams.get(constants.THIRD_PARTY_AUTH_URL_PARAM.AUTH_RESULT))
  } catch (err) {
    utils.log(constants.LOG_LEVEL.ERROR, err)
  }
  url.searchParams.delete(constants.THIRD_PARTY_AUTH_URL_PARAM.AUTH_RESULT)
  if (!authResult) {
    return Promise.reject(new HError(614, 'third party auth result not found'))
  } else if (
    authResult.status === constants.THIRD_PARTY_AUTH_STATUS.SUCCESS
    && authResult.action === constants.THIRD_PARTY_AUTH_HANDLER.LOGIN
  ) {
    history.replaceState && history.replaceState(null, '', url.toString())
    return BaaS.auth.getCurrentUser().then(user => {
      return Object.assign({}, authResult, user)
    })
  } else {
    history.replaceState && history.replaceState(null, '', url.toString())
    return Promise.resolve(authResult)
  }
}

// “第三方登录”请求
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

// “关联第三方账号”请求
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
    refererUrl.searchParams.set(constants.THIRD_PARTY_AUTH_URL_PARAM.AUTH_RESULT, JSON.stringify(authResult))
    window.location.href = refererUrl.toString()
  } else {
    const refererWindow = mode === constants.THIRD_PARTY_AUTH_MODE.POPUP_IFRAME
      ? window.parent
      : window.opener
    refererWindow.postMessage(authResult, referer)
  }
}

// 第三方授权成功后的操作。'login' 为登录，'associate' 为关联账号
const getHandler = handler => {
  const handlerList = [
    constants.THIRD_PARTY_AUTH_HANDLER.LOGIN,
    constants.THIRD_PARTY_AUTH_HANDLER.ASSOCIATE,
  ]
  if (handlerList.indexOf(handler) === -1) {
    throw new HError(614, `handler "${handler}" not found`)
  }
  return handler
}

const getErrorMsg = err => {
  let error = ''
  if (!err) return ''
  if (err.data && typeof err.data === 'object') {
    error = err.data.error_msg || err.data.message || err.data.error_message
  } else if (typeof err.data !== 'undefined') {
    error = err.data || err.statusText
  } else if (err.message) {   // error object
    error = err.message
  }
  return error
}

/*
 * 微信在 web 端 iframe 中授权时，在页面 URL 中添加 self_redirect 参数，使重定向发生在 iframe 中，
 * 参考 https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419316505&token=&lang=zh_CN
 */
const setExtraUrlParams = (url, options = {}) => {
  if (options.provider !== constants.THIRD_PARTY_AUTH_PROVIDER.WECHAT_WEB
    || options.mode !== constants.THIRD_PARTY_AUTH_MODE.POPUP_IFRAME) {
    return url
  }
  url = new URL(url)
  url.searchParams.set('self_redirect', true)
  if (!options.wechatIframeContentStyle) return url.toString()
  if (options.wechatIframeContentStyle.style) {
    url.searchParams.set('style', options.wechatIframeContentStyle.style)
  }
  if (options.wechatIframeContentStyle.href) {
    url.searchParams.set('href', options.wechatIframeContentStyle.href)
  }
  return url.toString()
}

/**
 * 跳转到第三方授权页面；获取 token 后调用 login 或 associate
 * @function
 * @name thirdPartyAuth
 * @since v2.1.0
 * @memberof BaaS.auth
 */
const createThirdPartyAuthFn = BaaS => () => {
  const PARAM = constants.THIRD_PARTY_AUTH_URL_PARAM
  const url = new URL(window.location.href)
  const params = url.searchParams
  const accessToken = params.get(PARAM.TOKEN)
  const provider = params.get(PARAM.PROVIDER)
  const referer = params.get(PARAM.REFERER)
  const mode = params.get(PARAM.MODE)
  const debug = params.get(PARAM.DEBUG)
  const handler = getHandler(params.get(PARAM.HANDLER))
  const create_user = params.get(PARAM.CREATE_USER)
  const update_userprofile = params.get(PARAM.UPDATE_USER_PROFILE)
  let wechatIframeContentStyle = {}
  try {
    wechatIframeContentStyle = JSON.parse(params.get(PARAM.WECHAT_IFRAME_CONTENT_STYLE))
  } catch (err) {
    utils.log(constants.LOG_LEVEL.ERROR, err)
  }
  const request = handler === constants.THIRD_PARTY_AUTH_HANDLER.LOGIN
    ? loginWithThirdPartyRequest
    : linkThirdPartyRequest
  if (accessToken) {
    // 授权成功
    return request(BaaS, {provider, token: accessToken, create_user, update_userprofile})
      .then(() => {
        const authResult = {
          status: constants.THIRD_PARTY_AUTH_STATUS.SUCCESS,
          action: handler,
        }
        sendMessage(mode, referer, authResult)
      })
      .catch(err => {
        const error = getErrorMsg(err)
        const authResult = {
          status: constants.THIRD_PARTY_AUTH_STATUS.FAIL,
          error,
          action: handler,
        }
        if (mode !== constants.THIRD_PARTY_AUTH_MODE.REDIRECT || !debug) {
          sendMessage(mode, referer, authResult)
        }
      })
  } else {
    // 跳转到第三方授权页面
    return BaaS.request({
      url: utils.format(BaaS._config.API.WEB.THIRD_PARTY_AUTH, {provider}),
      method: 'POST',
      data: {
        callback_url: window.location.href,
      },
    }).then(res => {
      if (res.status === constants.STATUS_CODE.SUCCESS && res.data.status === 'ok') {
        const url = setExtraUrlParams(res.data.redirect_url, {provider, mode, wechatIframeContentStyle})
        window.location.href = url
      } else {
        throw res
      }
    }).catch(err => {
      const error = getErrorMsg(err)
      const authResult = {
        status: constants.THIRD_PARTY_AUTH_STATUS.FAIL,
        error,
        action: handler,
      }
      if (mode !== constants.THIRD_PARTY_AUTH_MODE.REDIRECT || !debug) {
        sendMessage(mode, referer, authResult)
      }
      utils.log(constants.LOG_LEVEL.ERROR, err)
    })
  }
}

/**
 * 第三方登录<br />
 * <br />
 * 弹窗模式时序图：<br />
 * <img src="../images/login-with-third-party.png"><br />
 * <br />
 * 跳转模式时序图：<br />
 * <img src="../images/login-with-third-party-redirect.png"><br />
 *
 * @startuml login-with-third-party-popup.png
 *   用户 -> 发起登录的页面: 调用 loginWithThirdParty
 *   发起登录的页面 -> 授权页面: 打开
 *   授权页面 -> 授权页面: 调用 thirdPartyAuth
 *   授权页面 -> 第三方授权页面: 页面跳转
 *   第三方授权页面 -> 用户: 请求授权
 *   用户 -> 第三方授权页面: 授权
 *   第三方授权页面 -> 授权页面: 页面跳转（with token）
 *   授权页面 -> 授权页面: 调用 thirdPartyAuth
 *   授权页面 -> 后端: 请求 login 接口
 *   后端 -> 授权页面: 返回登录结果
 *   授权页面 -> 发起登录的页面: 返回登录结果
 *   发起登录的页面 -> 用户: 返回登录结果
 * @enduml
 *
 * @startuml login-with-third-party-redirect.png
 *   用户 -> 发起登录的页面: 调用 getRedirectResult
 *   发起登录的页面 -> 用户: 未找到登录结果
 *   用户 -> 发起登录的页面: 调用 loginWithThirdParty
 *   发起登录的页面 -> 授权页面: 跳转
 *   授权页面 -> 授权页面: 调用 thirdPartyAuth
 *   授权页面 -> 第三方授权页面: 页面跳转
 *   第三方授权页面 -> 用户: 请求授权
 *   用户 -> 第三方授权页面: 授权
 *   第三方授权页面 -> 授权页面: 页面跳转（with token）
 *   授权页面 -> 授权页面: 调用 thirdPartyAuth
 *   授权页面 -> 后端: 请求 login 接口
 *   后端 -> 授权页面: 返回登录结果
 *   授权页面 -> 发起登录的页面: 跳转回登录页面
 *   发起登录的页面 -> 用户: 返回登录结果
 *   用户 -> 发起登录的页面: 调用 getRedirectResult
 *   发起登录的页面 -> 用户: 返回登录结果
 * @enduml
 *
 * @function
 * @name loginWithThirdParty
 * @since v2.1.0
 * @memberof BaaS.auth
 * @param {string} provider 第三方平台
 * @param {string} authPageUrl 授权页面 URL
 * @param {BaaS.ThirdPartyLoginOptions} [options] 其他选项
 * @return {Promise<BaaS.CurrentUser>}
 */
const createLoginWithThirdPartyFn = BaaS => (provider, authPageUrl, options = {}) => {
  return thirdPartyAuthRequest(Object.assign({}, options, {
    provider,
    authPageUrl,
    handler: constants.THIRD_PARTY_AUTH_HANDLER.LOGIN,
  }))
    .then(() => BaaS.auth.getCurrentUser())
}

module.exports = function (BaaS) {
  BaaS.auth.silentLogin = utils.fnUnsupportedHandler
  BaaS.auth.thirdPartyAuth = utils.rateLimit(createThirdPartyAuthFn(BaaS))
  BaaS.auth.loginWithThirdParty = utils.rateLimit(createLoginWithThirdPartyFn(BaaS))
  BaaS.auth.getRedirectResult = createGetRedirectResultFn(BaaS)
}
