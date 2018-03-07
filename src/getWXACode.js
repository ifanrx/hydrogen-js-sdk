const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const HError = require('./HError')
const _isString = require('lodash/isString')

const API = BaaS._config.API

const makeRealParams = (type, params) => {
  const validateTypes = ['wxacode', 'wxacodeunlimit', 'wxaqrcode']
  const realTypeNames = ['miniapp_permanent', 'miniapp_temporary', 'miniapp_qr']
  let realParams = {}
  const typeIndex = validateTypes.indexOf(type)

  if (!_isString(type)  || typeIndex === -1) {
    throw new HError(605)
  }

  realParams.code_type = realTypeNames[typeIndex]

  if(!params || params.constructor !== Object) {
    throw new HError(605)
  }

  if (type === 'wxacode' || type === 'wxaqrcode') {
    if (!params.hasOwnProperty('path')) {
      throw new HError(605)
    }

    realParams.path = params.path
  }

  if (type === 'wxacodeunlimit') {
    if (!params.hasOwnProperty('scene')) {
      throw new HError(605)
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

  return realParams
}

const getWXACode = (type, params) => {
  let realParams = makeRealParams(type, params)

  return new Promise((resolve, reject) => {
    baasRequest({
      url: API.WXACODE,
      method: 'POST',
      data: realParams,
    }).then(res => {
      if(res.statusCode === 400) return reject(new HError(400, res.data.message))
      return resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

module.exports = getWXACode