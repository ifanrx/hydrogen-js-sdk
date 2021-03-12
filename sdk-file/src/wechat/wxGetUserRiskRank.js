const BaaS = require('core-module/baas')
const HError = require('core-module/HError')

const API = BaaS._config.API

/**
 * 微信安全风控等级查询
 * @function
 * @memberof BaaS
 * @param {BaaS.GetUserRiskRankOptions} options 参数对象
 * @return {Promise<any>}
 */
const wxGetUserRiskRank = options => {
  if (!validateOptions(options)) {
    throw new HError(605)
  }
  const { scene, mobileNo, emailAddress, extendedInfo } = options

  const paramsObj = {
    scene,
    mobile_no: mobileNo,
    email_address: emailAddress,
    extended_info: extendedInfo
  }

  return BaaS._baasRequest({
    url: API.WECHAT.USER_RISK_RANK,
    method: 'POST',
    data: paramsObj,
  })
}

const validateOptions = options => {
  if (typeof options !== 'object') return false
  if (options.scene === undefined) return false

  const validateScene = [0, 1]

  return validateScene.includes(parseInt(options.scene))
}

module.exports = wxGetUserRiskRank
