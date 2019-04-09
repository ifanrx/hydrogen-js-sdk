let LocalStorage = require('node-localstorage').LocalStorage
let testStorage = new LocalStorage('./test-storage/web')

let window = {}

// 模拟 window.localStorage
window.localStorage = testStorage

module.exports = window
