const Promise = require('./promise');
const request = require('./request');
const extend = require('node.extend');
const utils = require('./utils');
const user = require('./user');
const constants = require('./constants');
const BaaS = require('./baas');
const storage = require('./storage');

let isLogining = false;
let isAuthing = false;
let authResolve = [];
let loginResolve = [];

/**
 * auth
 * @return {Promise]
 */
const auth = () => {
  if (storage.get(constants.STORAGE_KEY.UID)) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  if (isAuthing) {
    return new Promise((resolve, reject) => {
      authResolve.push(resolve);
    });
  }

  isAuthing = true;
  return user.auth().then(() => {
    setTimeout(() => {
      while (authResolve.length) {
        authResolve.shift()();
      }
    }, 0);
    return new Promise((resolve, reject) => {
      resolve();
    });
  }, (err) => {
    throw new Error(err);
  });
};

/**
 * login
 * @return {Promise]
 */
const login = () => {
  if (BaaS.isLogined()) {
    return new Promise((resolve, reject) => {
      resolve(storage.get(constants.STORAGE_KEY.USERINFO));
    });
  }

  if (isLogining) {
    return new Promise((resolve, reject) => {
      loginResolve.push(resolve);
    });
  }

  isLogining = true;
  return auth().then(() => {
    return user.login();
  }).then(() => {
    setTimeout(() => {
      while (loginResolve.length) {
        loginResolve.shift()(storage.get(constants.STORAGE_KEY.USERINFO));
      }
    }, 0);
    return new Promise((resolve, reject) => {
      resolve(storage.get(constants.STORAGE_KEY.USERINFO));
    });
  }).catch((err) => {
    throw new Error(err);
  });
};

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
  return login().then(() => {
    isLogining = false;
    return request.apply(null, arguments);
  }, (err) => {
    throw new Error(err);
  });
};

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
  };

  for (let k in methodMap) {
    if (methodMap.hasOwnProperty(k)) {
      BaaS[k] = ((k) => {
        let methodItem = methodMap[k];
        return (objects) => {
          let method = methodItem.method || 'GET';
          let defaultParamsCopy = extend({}, methodItem.defaultParams)

          if (methodItem.defaultParams) {
            objects = extend(defaultParamsCopy, objects)
          }

          let url = utils.format(methodItem.url, objects);
          let data = (objects && objects.data) || objects;
          data = utils.excludeParams(url, data);

          return new Promise((resolve, reject) => {
            return baasRequest({ url, method, data }).then((res) => {
              if (res.statusCode == HTTPMethodCodeMap[method]) {
                resolve(res);
              } else {
                reject(constants.MSG.STATUS_CODE_ERROR);
              }
            }, (err) => {
              reject(err);
            });
          });

        };
      })(k);
    }
  }
};

/**
 * 遍历 METHOD_MAP_LIST，对每个 methodMap 调用 doCreateRequestMethod(methodMap)
 */
const createRequestMethod = () => {
  let methodMapList = BaaS._config.METHOD_MAP_LIST;
  methodMapList.map((v) => {
    doCreateRequestMethod(v);
  });
};

module.exports = {
  baasRequest,
  login,
  auth,
  createRequestMethod,
  doCreateRequestMethod
};
