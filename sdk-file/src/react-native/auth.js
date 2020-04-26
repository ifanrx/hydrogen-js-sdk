const utils = require('core-module/utils')

const PROVIDER_APPLE = 'apple'

module.exports = function (BaaS) {
  const API = BaaS.API
  /**
   * 将第三方账号绑定到当前用户（使用 auth_data 绑定），匿名用户无法调用
   * @since v3.13.0
   * @memberof BaaS.auth
   * @param {BaaS.LoginWithAuthDataAuthData} authData 授权页面 URL
   * @param {BaaS.LoginWithLinkAuthDataOptions} [options] 其他选项
   * @returns {Promise<this>} UserRecord 实例
   */
  BaaS.auth.loginWithAuthData = ({token, username}, {provider, createUser = true, syncUserProfile = 'setnx'}) => {
    const url = utils.format(API.NATIVE_OAUTH_AUTH, {
      provider: `${provider}-native`,
    })
    const data = {
      auth_token: token,
      create_user: createUser,
      update_userprofile: syncUserProfile,
    }
    if (provider == PROVIDER_APPLE) {
      data.username = username
    }
    return BaaS._baasRequest({
      url,
      method: 'POST',
      data,
    })
  }

  BaaS.auth.linkAuthData = ({token, username}, {provider, syncUserProfile = 'setnx'}) => {
    const url = utils.format(API.NATIVE_OAUTH_ASSOCIATION, {
      provider: `${provider}-native`,
    })
    const data = {
      auth_token: token,
      update_userprofile: syncUserProfile,
    }
    if (provider == PROVIDER_APPLE) {
      data.username = username
    }
    return BaaS._baasRequest({
      url,
      method: 'POST',
      data,
    })
  }
}
