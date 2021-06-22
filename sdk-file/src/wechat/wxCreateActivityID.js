const BaaS = require('core-module/baas')

const API = BaaS._config.API

/**
 * 微信创建私密消息的activity_id
 * @function
 * @memberof BaaS
 * @return {Promise<any>}
 */
const wxCreateActivityID = () => {
  return BaaS._baasRequest({
    url: API.WECHAT.PRIVATE_MESSAGE,
    method: 'POST',
  })
}

module.exports = wxCreateActivityID
