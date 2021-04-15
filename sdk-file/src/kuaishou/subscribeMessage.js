const BaaS = require('core-module/baas')
const constants = require('core-module/constants')

const API = BaaS._config.API

module.exports = function (BaaS) {
  /**
   * 上报订阅消息订阅关系
   * @function
   * @memberof BaaS
   * @param {BaaS.SubscribeMessageOptions} options 参数
   * @return {Promise<BaaS.Response<any>>}
   */
  BaaS.subscribeMessage = options => {
    return BaaS._baasRequest({
      url: API.KUAISHOU.SUBSCRIBE_MESSAGE,
      method: 'POST',
      data: {
        platform: constants.PLATFORM.KUAISHOU,
        ...options,
      },
    })
  }
}
