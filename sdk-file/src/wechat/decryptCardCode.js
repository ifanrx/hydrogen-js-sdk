const HError = require('core-module/HError')

/**
 * 微信卡券解密
 * @function
 * @name decryptCardCode
 * @since v3.7.0
 * @memberof BaaS
 * @param {string} cardId 卡券 ID
 * @param {string} code 加密 code，为用户领取到卡券的 code 加密后的字符串
 * @return {Promise<any>}
 */
const createDecryptCardCodeFn = BaaS => (cardId, code) => {
  const API = BaaS._config.API

  return BaaS._baasRequest({
    url: API.WECHAT.CARD_CODE_DECRYPT,
    method: 'POST',
    data: {
      code,
      card_id: cardId,
    },
  }).then(res => {
    return res.data
  }, err => {
    let code = err.code
    if (code === 403) throw new HError(403, '微信解密插件未开启')
    throw err
  })
}

module.exports = function (BaaS) {
  BaaS.decryptCardCode = createDecryptCardCodeFn(BaaS)
}
