const BaaS = require('core-module/baas')

const API = BaaS._config.API

module.exports = function (BaaS) {
  /**
   * 上报订阅消息订阅关系
   * @function
   * @memberof BaaS
   * @param {BaaS.SubscribeMessageOptions} options 参数
   * @return {Promise<BaaS.Response<any>>}
   */
  BaaS.subscribeMessage = (subscription) => {
    return BaaS._baasRequest({
      url: API.WECHAT.SUBSCRIBE_MESSAGE,
      method: 'POST',
      data: subscription,
    })
  }
}
