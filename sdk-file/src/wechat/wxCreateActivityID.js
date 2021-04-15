const BaaS = require('core-module/baas')
const HError = require('core-module/HError')

const API = BaaS._config.API

/**
 * 微信创建私密消息的activity_id
 * @function
 * @memberof BaaS
 * @param {BaaS.CreateActivityIDOptions} options 参数对象
 * @return {Promise<any>}
 */
const wxCreateActivityID = options => {
  if (!validateOptions(options)) {
    throw new HError(605)
  }
  const { unionid, openid } = options

  const paramsObj = {
    unionid, openid,
  }

  return BaaS._baasRequest({
    url: API.WECHAT.PRIVATE_MESSAGE,
    method: 'POST',
    data: paramsObj,
  })
}

const validateOptions = options => {
  if (typeof options !== 'object') return false
  if (
    options.unionid !== undefined
    && typeof options.unionid !== 'string'
  ) return false
  if (
    options.openid !== undefined
    && typeof options.openid !== 'string'
  ) return false
  
  return true
}

module.exports = wxCreateActivityID
