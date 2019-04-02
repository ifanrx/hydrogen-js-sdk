const axios = require('axios')

let LocalStorage = require('node-localstorage').LocalStorage
let testStorage = new LocalStorage('./test-storage')

let wx = {}

// 暂时不需要这个 mock
// eslint-disable-next-line no-unused-vars
// wx.request = ({ url, method = 'GET', data = {}, header, dataType = 'json', success, fail }) => {
//   let headerList = []
//
//   for (let key in header) {
//     headerList.push({
//       key: header[key]
//     })
//   }
//
//   axios({
//     method,
//     url,
//     data,
//     headers: headerList
//   }).then((res) => {
//     let response = {
//       data: res.data,
//       statusCode: res.status
//     }
//     success && success(response)
//   }, (err) => {
//     let response = {
//       data: err.data,
//       statusCode: err.status
//     }
//     fail && fail(response)
//   })
// }

wx.getNetworkType = function () {console.log('xxx')}

// 模拟 wx.setStorageSync 函数
wx.setStorageSync = (key, value) => {
  testStorage.setItem(key, value)
}

// 模拟 wx.getStorageSync 函数
wx.getStorageSync = (key) => {
  return testStorage.getItem(key)
}

// 模拟 wx.login 函数
wx.login = ({ success }) => {
  success && success({ code: 'mock wx.login code' })
}

// 模拟 wx.getUserInfo 函数
wx.getUserInfo = ({ success }) => {
  success && success({
    userInfo: 'userInfo+',
    rawData: 'rawData+',
    signature: 'signature+',
    encryptedData: 'encryptedData+',
    iv: 'iv+'
  })
}

module.exports = wx
