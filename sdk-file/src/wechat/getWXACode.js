const BaaS = require('core-module/baas')
const HError = require('core-module/HError')
const utils = require('core-module/utils')

const API = BaaS._config.API

const makeRealParams = (type, params, cdn, categoryName) => {
  const validateTypes = ['wxacode', 'wxacodeunlimit', 'wxaqrcode']
  const realTypeNames = ['miniapp_permanent', 'miniapp_temporary', 'miniapp_qr']
  let realParams = {}
  const typeIndex = validateTypes.indexOf(type)

  if (!utils.isString(type) || typeIndex === -1) {
    throw new HError(605, 'type 为字符串类型且只接受 "wxacode", "wxacodeunlimit", "wxaqrcode" 其中一种')
  }

  realParams.code_type = realTypeNames[typeIndex]

  if (!params || params.constructor !== Object) {
    throw new HError(605, 'params 为 Object 类型')
  }

  if (type === 'wxacode' || type === 'wxaqrcode') {
    if (!params.hasOwnProperty('path')) {
      throw new HError(605, '当 type 为 "wxacode" 或 "wxaqrcode" 时，params 中必须带有 "path" 属性')
    }

    realParams.path = params.path
  }

  if (type === 'wxacodeunlimit') {
    if (!params.hasOwnProperty('scene')) {
      throw new HError(605, '当 type 为 "wxacodeunlimit" 时，params 中必须带有 "scene" 属性')
    }

    realParams.scene = params.scene

    if (params.hasOwnProperty('page')) {
      realParams.path = params.page
    }
  }

  realParams.options = {}

  if (params.hasOwnProperty('width')) {
    realParams.options.width = params.width
  }

  if (params.hasOwnProperty('auto_color')) {
    realParams.options.auto_color = params.auto_color
  }

  if (params.hasOwnProperty('line_color')) {
    realParams.options.line_color = params.line_color
  }

  if (params.hasOwnProperty('is_hyaline')) {
    realParams.options.is_hyaline = params.is_hyaline
  }

  if (cdn === true) {
    realParams.upload_to_cdn = true
    if (categoryName) {
      realParams.category_name = categoryName
    }
  }

  return realParams
}

/**
 * 获取二维码
 * @function
 * @memberof BaaS
 * @param {string} type 类型
 * @param {object} params 参数
 * @param {boolean} [cdn] 是否上传二维码到文件存储并返回图片链接，默认为 false
 * @param {string} [categoryName] 指定上传文件分类名，cdn 为 true 时有效，不指定该参数或分类名不存在，则默认上传到根目录
 * @return {Promise<any>}
 */
const getWXACode = (type, params, cdn, categoryName) => {
  let realParams = makeRealParams(type, params, cdn, categoryName)

  return BaaS._baasRequest({
    url: API.WECHAT.WXACODE,
    method: 'POST',
    data: realParams,
  }).then(res => {
    return res.data
  })
}

module.exports = getWXACode
