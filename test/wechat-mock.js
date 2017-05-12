const axios = require('axios');

var LocalStorage = require('node-localstorage').LocalStorage;
var testStorage = new LocalStorage('./test-storage');

let wx = {};

// 模拟 wx.request 函数
wx.request = ({ url, method = 'GET', data = {}, header, dataType = 'json', success, fail }) => {
  let headerList = [];

  for (let key in header) {
    headerList.push({
      key: header[key]
    });
  }

  axios({
    method,
    url,
    data,
    headers: headerList
  }).then((res) => {
    let response = {
      data: res.data,
      statusCode: res.status
    };
    success && success(response);
  }, (err) => {
    let response = {
      data: res.data,
      statusCode: res.status
    };
    fail && fail(response);
  });

};

// 模拟 wx.setStorageSync 函数
wx.setStorageSync = (key, value) => {
  testStorage.setItem(key, value);
};

// 模拟 wx.getStorageSync 函数
wx.getStorageSync = (key) => {
  return testStorage.getItem(key);
};

// 模拟 wx.login 函数
wx.login = ({ success, fail }) => {
  success && success({ code: 'mock wx.login code' });
};

// 模拟 wx.getUserInfo 函数
wx.getUserInfo = ({ success, fail, complete }) => {
  success && success({
    userInfo: 'userInfo+',
    rawData: 'rawData+',
    signature: 'signature+',
    encryptedData: 'encryptedData+',
    iv: 'iv+'
  });
};

module.exports = wx;
