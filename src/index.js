const BaaS = require('./baas')

// 暴露指定 BaaS 方法
BaaS.auth = require('./baasRequest').auth
BaaS.GeoPoint = require('./geoPoint')
BaaS.GeoPolygon = require('./geoPolygon')
BaaS.login = require('./user').login
BaaS.logout = require('./user').logout
BaaS.order = require('./order')
BaaS.pay = require('./pay')
BaaS.Promise = require('./promise')
BaaS.Query = require('./query')
BaaS.request = require('./request')
BaaS.wxReportTicket = require('./templateMessage').wxReportTicket
BaaS.storage = require('./storage')
BaaS.TableObject = require('./tableObject')
BaaS.uploadFile = require('./uploadFile')
BaaS.wxDecryptData = require('./wxDecryptData')

// 初始化 BaaS 逻辑，添加更多的方法到 BaaS 对象
require('./baasRequest').createRequestMethod()

// 暴露 BaaS 到小程序环境
if (typeof wx !== 'undefined') {
  wx.BaaS = BaaS
}

module.exports = BaaS
