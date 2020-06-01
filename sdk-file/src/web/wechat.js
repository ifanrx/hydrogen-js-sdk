module.exports = function (BaaS) {
  /**
   * 
   * @memberof BaaS
   * @param {string} url 当前页面的完整 UR，不包含 # 及其后面部分
   * @return {Promise<any>}
   */
  BaaS.getWechatJSSDKCredentials = function (url) {
    // if (!url) {
    //   throw new HError(605, 'url 必填')
    // }

    // if (url.indexOf('#')) {
    //   throw new HError(605, 'url 不能包含 #')
    // }

    return BaaS._baasRequest({
      url: BaaS._config.API.WECHAT.JSSDK_CREDENTIALS,
      method: 'GET',
      data: {url},
    })
      .then(res => res.data)
  }
}
