const request = require('./request');
const BaaS = require('./baas');
const constants = require('./constants');
const utils = require('./utils');
const storage = require('./storage');
const Promise = require('./promise');
const API = BaaS._config.API;

/**
 * 初始化会话
 * @param  {String} code      wx.login 后返回的 code
 * @param  {Function} resolve Promise resolve function
 * @param  {Function} reject  Promise reject function
 * @return {Promise}
 */
const sessionInit = (code, resolve, reject) => {
  return request({
    url: API.INIT,
    method: 'POST',
    data: {
      code: code
    }
  }).then((res) => {
    if (res.statusCode == constants.STATUS_CODE.CREATED) {
      storage.set(constants.STORAGE_KEY.UID, res.data.user_id);
      storage.set(constants.STORAGE_KEY.AUTH_TOKEN, res.data.token);
      resolve(res);
    } else {
      reject(constants.MSG.STATUS_CODE_ERROR);
    }
  }, (err) => {
    reject(err);
  });
};

/**
 * 验证客户端
 * @return {Promise}
 */
const auth = () => {

  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        return sessionInit(res.code, resolve, reject);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });

};

/**
 * 登录 BaaS
 * @param  {Object} data    微信签名等信息
 * @param  {Function} resolve Promise resolve function
 * @param  {Function} reject  Promise reject function
 * @return {Promise}
 */
const authenticate = (data, resolve, reject) => {
  return request({
    url: API.LOGIN,
    method: 'POST',
    data: data
  }).then((res) => {
    if (res.statusCode == constants.STATUS_CODE.CREATED) {
      storage.set(constants.STORAGE_KEY.IS_LOGINED_BAAS, '1');
      resolve(res);
    } else {
      reject(constants.MSG.STATUS_CODE_ERROR);
    }
  }, (err) => {
    reject(err);
  });
};

/**
 * 登录
 * @return {Promise}
 */
const login = () => {
  if (!BaaS.getAuthToken()) {
    throw new Error('未认证客户端');
  }
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: (res) => {
        let payload = {
          rawData: res.rawData,
          signature: res.signature,
          encryptedData: res.encryptedData,
          iv: res.iv
        };
        storage.set(constants.STORAGE_KEY.USERINFO, res.userInfo);
        return authenticate(payload, resolve, reject);
      },
      fail: (err) => {
        // 用户拒绝授权也要继续进入下一步流程
        resolve('');
      },
    });
  });
};

/**
 * 退出登录
 * @return {Promise}
 */
const logout = () => {

  BaaS.check();

  return request({ url: API.LOGOUT, method: 'POST' }).then((res) => {
    if (res.statusCode == constants.STATUS_CODE.CREATED) {
      BaaS.clearSession();
    } else {
      throw new Error(constants.MSG.STATUS_CODE_ERROR);
    }
  }, (err) => {
    throw new Error(err);
  });
};

module.exports = {
  auth,
  login,
  logout,
};
