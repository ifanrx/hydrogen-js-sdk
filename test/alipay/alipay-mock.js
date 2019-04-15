let LocalStorage = require('node-localstorage').LocalStorage
let testStorage = new LocalStorage('./test-storage/alipay')

let my = {}
let code = 'code-mock'

// 模拟 my.setStorageSync 函数
my.setStorageSync = (options) => {
  testStorage.setItem(options.key, options.data)
}

// 模拟 my.getStorageSync 函数
my.getStorageSync = (options) => {
  return {
    data: testStorage.getItem(options.key),
  }
}

my.getAuthCode = ({success}) => {
  success({authCode: code})
}

module.exports = my
