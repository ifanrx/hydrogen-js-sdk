const BaaS = require('core-module/baas')
const constants = require('core-module/constants')

const API = BaaS._config.API

module.exports = function (BaaS) {
  /**
   * 上报订阅消息订阅关系
   * @function
   * @memberof BaaS
   * @return {Promise<BaaS.Response<any>>}
   */
  BaaS.subscribeMessage = () => {
    return BaaS._baasRequest({
      url: API.QQ.SUBSCRIBE_MESSAGE,
      method: 'POST',
      data: {
        platform: constants.PLATFORM.QQ,
      },
    })
  }
}
