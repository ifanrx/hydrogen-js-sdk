const BaaS = require('core-module/baas')
const core = require('core-module/index')
const wechatAuth = require('./auth')
const polyfill = require('./polyfill')
const censor = require('./censor')
const reportTemplateMsgAnalytics = require('./reportTemplateMsgAnalytics')

BaaS._config.VERSION = __VERSION_WECHAT__

BaaS.use(core)
BaaS.use(polyfill)
BaaS.use(wechatAuth)
BaaS.use(censor)
BaaS.use(reportTemplateMsgAnalytics)
BaaS.pay = require('./pay')
BaaS.order = require('./order')
BaaS.request = require('./request')
BaaS._baasRequest = require('./baasRequest')
BaaS.uploadFile = require('./uploadFile')
BaaS.getWXACode = require('./getWXACode')
BaaS.wxDecryptData = require('./wxDecryptData')
BaaS.wxReportTicket = require('./wxReportTicket')
BaaS.ErrorTracker = require('./errorTracker')
BaaS._createRequestMethod()
// 暴露 BaaS 到小程序环境
if (typeof wx !== 'undefined') {
  /**
   * @interface WX
   */

  /**
   * @constant
   * @name wx
   * @type {WX}
   */

  /**
   * BaaS
   * @type {BaaS}
   * @name BaaS
   * @memberof WX
   */
  wx.BaaS = BaaS
}

module.exports = BaaS
