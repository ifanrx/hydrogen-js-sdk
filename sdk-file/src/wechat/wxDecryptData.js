const BaaS = require('core-module/baas')
const HError = require('core-module/HError')
const utils = require('core-module/utils')

const API = BaaS._config.API

const compareSDKVersion = targetVersion => {
  const version = BaaS._polyfill.getSystemInfoSync().SDKVersion
  const isSDKVersionNewer = utils.compareBaseLibraryVersion(version, targetVersion) >= 0
  return isSDKVersionNewer
}

/**
 * 微信加密数据解密
 * @function
 * @memberof BaaS
 * @param {string} encryptedData 加密的数据
 * @param {string} iv 加密算法的初始向量
 * @param {string} type 数据类型
 * @param {string} [code] 通过 bindgetphonenumber 事件回调获取到动态令牌 code（基础库 2.21.2 后新增）
 * @return {Promise<any>}
 */
const wxDecryptData = (...params) => {
  if (!validateParams(params)) {
    throw new HError(605)
  }

  const [encryptedData, iv, type, phone_code] = params

  const isSDKVersionNewer = compareSDKVersion('2.21.2')

  const paramsObj = {
    encryptedData,
    iv,
    ...(isSDKVersionNewer ? {phone_code} : {}),
  }

  const url = isSDKVersionNewer ? API.WECHAT.DECRYPT : API.WECHAT.DECRYPT_OLD

  return BaaS._baasRequest({
    url: url + type + '/',
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
  const isSDKVersionNewer = compareSDKVersion('2.21.2')
  if (
    !(params instanceof Array)
    || params.length < 3
    || (isSDKVersionNewer && params[2] === 'phone-number' && params.length < 4)
  ) return false

  const requiredDataKeys = ['we-run-data', 'open-gid', 'phone-number']

  return requiredDataKeys.includes(params[2])
}

module.exports = wxDecryptData
