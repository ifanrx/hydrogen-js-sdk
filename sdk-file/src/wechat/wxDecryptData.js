const BaaS = require('core-module/baas')
const HError = require('core-module/HError')

const API = BaaS._config.API

/**
 * 微信加密数据解密
 * @function
 * @memberof BaaS
 * @param {string} encryptedData 加密的数据
 * @param {string} iv 加密算法的初始向量
 * @param {string} type 数据类型
 * @return {Promise<any>}
 */
const wxDecryptData = (...params) => {
  if (!validateParams(params)) {
    throw new HError(605)
  }

  const isPhoneNumber = params[1] === 'phone-number'

  const paramsObj = isPhoneNumber
    ? {code: params[0]}
    : {
      encryptedData: params[0],
      iv: params[1],
    }

  const subUrl = isPhoneNumber ? params[1] : params[2]
  const url = API.WECHAT.DECRYPT + subUrl + '/'

  return BaaS._baasRequest({
    url,
    method: 'POST',
    data: paramsObj,
  }).then(res => {
    return res.data
  }, err => {
    let code = err.code
    if (code === 403) throw new HError(403, '微信解密插件未开启')
    throw err
  })
}

const validateParams = params => {
  if (!(params instanceof Array) || params.length < 3) return false

  const requiredDataKeys = ['we-run-data', 'open-gid', 'phone-number']

  return requiredDataKeys.includes(params[2])
}

module.exports = wxDecryptData
