const HError = require('core-module/HError')

module.exports = BaaS => {
  /**
   * 检测违规文本
   * @function
   * @memberof BaaS
   * @param {string} text 带检测的文本内容
   * @return {Promise<any>}
   */
  const censorText = text => {
    if (!text || typeof text !== 'string') {
      return Promise.reject(new HError(605))
    }
    return BaaS._baasRequest({
      url: BaaS._config.API.ALIPAY.CENSOR_MSG,
      method: 'POST',
      data: {
        content: text
      }
    })
  }

  BaaS.censorText = censorText
}
