module.exports = function (BaaS) {
  /**
   * 
   * @memberof BaaS
   * @param {string} url 当前页面的完整 UR，不包含 # 及其后面部分
   * @return {Promise<any>}
   */
  BaaS.getWechatJSSDKCredentials = function (url) {
    return BaaS.request({
      url: BaaS._config.API.WEB.WECHAT_JSSDK_CREDENTIALS,
      method: 'GET',
      data: {url},
    }).then(res => res.data)
  }
}
