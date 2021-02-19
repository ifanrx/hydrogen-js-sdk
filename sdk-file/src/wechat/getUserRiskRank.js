const BaaS = require('core-module/baas')
const HError = require('core-module/HError')

const API = BaaS._config.API

/**
 * 微信安全风控等级查询
 * @function
 * @memberof BaaS
 * @param {number} scene 场景值
 * @param {string} mobile_no 用户手机号
 * @param {string} email_address 用户邮件地址
 * @param {string} extended_info 额外信息
 * @return {Promise<any>}
 */
const getUserRiskRank = (...params) => {
  if (!validateParams(params)) {
    throw new HError(605)
  }

  let paramsObj = {
    scene: params[0],
    mobile_no: params[1],
    email_address: params[2],
    extended_info: params[3],
  }

  return BaaS._baasRequest({
    url: API.WECHAT.USER_RISK_RANK,
    method: 'POST',
    data: paramsObj,
  })
}

const validateParams = (params) => {
  if (params[0] === undefined) return false

  const validateScene = [0, 1]

  return validateScene.indexOf(parseInt(params[0])) !== -1
}

module.exports = getUserRiskRank
