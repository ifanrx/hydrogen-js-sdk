const BaaS = require('core-module/baas')

const API = BaaS._config.API

module.exports = function (BaaS) {
  BaaS.subscribeMessage = (subscription) => {
    return BaaS._baasRequest({
      url: API.WECHAT.SUBSCRIBE_MESSAGE,
      method: 'POST',
      data: subscription,
    })
  }
}
