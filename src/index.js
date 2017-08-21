const BaaS = require('./baas');

// 暴露指定 BaaS 方法
BaaS.Promise = require('./promise');
BaaS.storage = require('./storage');
BaaS.request = require('./request');
BaaS.pay = require('./pay');
BaaS.auth = require('./baasRequest').auth;
BaaS.login = require('./baasRequest').login;
BaaS.logout = require('./user').logout;
BaaS.uploadFile = require('./uploadFile')
BaaS.order = require('./order')
BaaS.TableObject = require('./tableObject')
BaaS.Query = require('./query')
BaaS.GeoPoint = require('./geoPoint')
BaaS.GeoPolygon = require('./geoPolygon')

// 初始化 BaaS 逻辑，添加更多的方法到 BaaS 对象
require('./baasRequest').createRequestMethod();

// 暴露 BaaS 到小程序环境
if (typeof wx !== 'undefined') {
  wx.BaaS = BaaS;
}

module.exports = BaaS;
