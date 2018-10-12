const auth = require('./auth')
const BaaS = require('./baas')
const HError = require('./HError')
const request = require('./request')
const utils = require('./utils')


// BaaS 网络请求，此方法能保证在已登录 BaaS 后再发起请求
// eslint-disable-next-line no-unused-vars
const baasRequest = function ({url, method = 'GET', data = {}, header = {}, dataType = 'json'}) {
  return auth.silentLogin().then(() => {
    return request.apply(null, arguments)
  })
}


/**
 * 根据 methodMap 创建对应的 BaaS Method
 * @param  {Object} methodMap 按照指定格式配置好的方法配置映射表
 */
const doCreateRequestMethod = (methodMap) => {
  for (let k in methodMap) {
    if (methodMap.hasOwnProperty(k)) {
      BaaS[k] = ((k) => {
        let methodItem = methodMap[k]
        return (objects) => {
          let newObjects = utils.cloneDeep(objects)
          let method = methodItem.method || 'GET'

          if (methodItem.defaultParams) {
            let defaultParamsCopy = utils.cloneDeep(methodItem.defaultParams)
            newObjects = utils.extend(defaultParamsCopy, newObjects)
          }

          // 替换 url 中的变量为用户输入的数据，如 tableID, recordID
          let url = utils.format(methodItem.url, newObjects)

          let data = {}
          if (newObjects.data) {
            // 存在 data 属性的请求参数，只有 data 部分作为请求数据发送到后端接口
            data = newObjects.data
          } else {
            // 从用户输入的数据中，剔除 tableID, recordID 等用于 url 的数据
            data = excludeParams(methodItem.url, newObjects)

            // 将用户输入的数据中，部分变量名替换为后端可接受的名字，如 categoryID 替换为 category_id
            data = utils.replaceQueryParams(data)
          }

          return new Promise((resolve, reject) => {
            return baasRequest({url, method, data}).then((res) => {
              let status = parseInt(res.statusCode)
              if (status >= 200 && status < 300) {
                resolve(res)
              } else {
                reject(new HError(res.statusCode, utils.extractErrorMsg(res)))
              }
            }, err => {
              reject(err)
            })
          })
        }
      })(k)
    }
  }
}

/**
 * 把 URL 中的参数占位替换为真实数据，同时将这些数据从 params 中移除， params 的剩余参数传给 data eg. xxx/:tabelID/xxx => xxx/1001/xxx
 * @param  {Object} params 参数对象, 包含传给 url 的参数，也包含传给 data 的参数
 */
const excludeParams = (URL, params) => {
  URL.replace(/:(\w*)/g, (match, m1) => {
    if (params[m1] !== undefined) {
      delete params[m1]
    }
  })
  return params
}

// 遍历 METHOD_MAP_LIST，对每个 methodMap 调用 doCreateRequestMethod(methodMap)
const createRequestMethod = () => {
  let methodMapList = BaaS._config.METHOD_MAP_LIST
  methodMapList.map((v) => {
    doCreateRequestMethod(v)
  })
}

module.exports = {
  baasRequest,
  excludeParams,
  createRequestMethod,
  doCreateRequestMethod
}
