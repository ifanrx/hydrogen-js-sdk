let LocalStorage = require('node-localstorage').LocalStorage
let testStorage = new LocalStorage('./test-storage/alipay')

let my = {}
let code = 'code-mock'

// 模拟 my.setStorageSync 函数
my.setStorageSync = (options) => {
  testStorage.setItem(options.key, JSON.stringify(options.data))
}

// 模拟 my.getStorageSync 函数
my.getStorageSync = (options) => {
  return {
    data: JSON.parse(testStorage.getItem(options.key)),
  }
}

my.getStorage = ({key, success}) => {
  return success({
    data: JSON.parse(testStorage.getItem(key)),
  })
}

my.setStorage = ({key, data, success}) => {
  testStorage.setItem(key, JSON.stringify(data))
  return success()
}

my.getAuthCode = ({success}) => {
  success({authCode: code})
}

module.exports = my
