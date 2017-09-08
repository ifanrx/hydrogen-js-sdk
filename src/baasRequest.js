const BaaS = require('./baas')
const constants = require('./constants')
const extend = require('node.extend')
const Promise = require('./promise')
const request = require('./request')
const storage = require('./storage')
const utils = require('./utils')
const user = require('./user')


/**
 * BaaS 网络请求，此方法能保证在已登录 BaaS 后再发起请求
 * @param  {String} url                   url地址
 * @param  {String} [method='GET']        请求方法
 * @param  {Object|String} data           请求参数
 * @param  {Object} header                请求头部
 * @param  {String} [dataType='json']     发送数据的类型
 * @return {Object}                       返回一个 Promise 对象
 */
const baasRequest = function ({ url, method = 'GET', data = {}, header = {}, dataType = 'json' }) {
  return user.login().then(() => {
    return request.apply(null, arguments)
  }, (err) => {
    throw new Error(err)
  })
}


/**
 * 根据 methodMap 创建对应的 BaaS Method
 * @param  {Object} methodMap 按照指定格式配置好的方法配置映射表
 */
const doCreateRequestMethod = (methodMap) => {
  const HTTPMethodCodeMap = {
    GET: constants.STATUS_CODE.SUCCESS,
    POST: constants.STATUS_CODE.CREATED,
    PUT: constants.STATUS_CODE.UPDATE,
    PATCH: constants.STATUS_CODE.PATCH,
    DELETE: constants.STATUS_CODE.DELETE
  }

  for (let k in methodMap) {
    if (methodMap.hasOwnProperty(k)) {
      BaaS[k] = ((k) => {
        let methodItem = methodMap[k]
        return (objects) => {
          let newObjects = extend(true, {}, objects)
          let method = methodItem.method || 'GET'

          if (methodItem.defaultParams) {
            let defaultParamsCopy = extend({}, methodItem.defaultParams)
            newObjects = extend(defaultParamsCopy, newObjects)
          }

          let url = utils.format(methodItem.url, newObjects)
          let data = (newObjects && newObjects.data) || newObjects
          data = utils.excludeParams(methodItem.url, data)
          data = utils.replaceQueryParams(url, data)

          return new Promise((resolve, reject) => {
            return baasRequest({ url, method, data }).then((res) => {
              if (res.statusCode == HTTPMethodCodeMap[method]) {
                resolve(res)
              } else {
                reject(constants.MSG.STATUS_CODE_ERROR)
              }
            }, (err) => {
              reject(err)
            })
          })
        }
      })(k)
    }
  }
}


/**
 * 遍历 METHOD_MAP_LIST，对每个 methodMap 调用 doCreateRequestMethod(methodMap)
 */
const createRequestMethod = () => {
  let methodMapList = BaaS._config.METHOD_MAP_LIST
  methodMapList.map((v) => {
    doCreateRequestMethod(v)
  })
}


module.exports = {
  baasRequest,
  createRequestMethod,
  doCreateRequestMethod
}
