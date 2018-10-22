const BaaS = require('./baas')

// 暴露指定 BaaS 方法
BaaS.auth = require('./baasRequest').auth
BaaS.ContentGroup = require('./ContentGroup')
BaaS.File = require('./File')
BaaS.FileCategory = require('./FileCategory')
BaaS.GeoPoint = require('./GeoPoint')
BaaS.GeoPolygon = require('./GeoPolygon')
BaaS.getWXACode = require('./getWXACode')
BaaS.handleUserInfo = require('./auth').handleUserInfo
BaaS.invokeFunction = require('./invokeFunction')
BaaS.login = require('./auth').login
BaaS.logout = require('./auth').logout
BaaS.order = require('./order').order
BaaS.Order = require('./order')
BaaS.pay = require('./pay')
BaaS.Query = require('./Query')
BaaS.request = require('./request')
BaaS.storage = require('./storage')
BaaS.TableObject = require('./TableObject')
BaaS.uploadFile = require('./uploadFile')
BaaS.User = require('./User')
BaaS.wxDecryptData = require('./wxDecryptData')
BaaS.wxReportTicket = require('./templateMessage').wxReportTicket
require('./censor')(BaaS)
require('./bugout')(BaaS)

// 初始化 BaaS 逻辑，添加更多的方法到 BaaS 对象
require('./baasRequest').createRequestMethod()

// 暴露 BaaS 到小程序环境
if (typeof wx !== 'undefined') {
  wx.BaaS = BaaS
}

module.exports = BaaS
