const HError = require('core-module/HError')

/**
 * QQ 加密数据解密
 * @function
 * @name decryptData
 * @since v2.4.0
 * @memberof BaaS
 * @param {string} encryptedData 加密的数据
 * @param {string} iv 加密算法的初始向量
 * @param {string} type 数据类型
 * @return {Promise<any>}
 */
const createDecryptDataFn = BaaS => (...params) => {
  const API = BaaS._config.API

  if (!validateParams(params)) {
    throw new HError(605)
  }

  let paramsObj = {
    encryptedData: params[0],
    iv: params[1]
  }

  return BaaS._baasRequest({
    url: API.QQ.DECRYPT + params[2] + '/',
    method: 'POST',
    data: paramsObj,
  }).then(res => {
    return res.data
  }, err => {
    let code = err.code
    if (code === 403) throw new HError(403, 'QQ 解密插件未开启')
    throw err
  })
}

const validateParams = (params) => {
  if (!(params instanceof Array) || params.length < 3) return false
  const requiredDataKeys = ['open-gid']
  return requiredDataKeys.indexOf(params[2]) !== -1
}

module.exports = function (BaaS) {
  BaaS.decryptData = createDecryptDataFn(BaaS)
}
