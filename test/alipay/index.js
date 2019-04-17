'use strict'

if (typeof require !== 'undefined') {
  // 为了兼容 webpack alias 与 DefinePlugin
  global.__VERSION_ALIPAY__ = 'v1.0.0'
  const moduleAlias = require('module-alias')
  moduleAlias.addAlias('core-module', __dirname + '../../../core')

  global.my = require('./alipay-mock')
  let BaaS = require('../../sdk-file/src/alipay')
  global.BaaS = BaaS

  // 模拟 wx 方法
}

// BaaS 测试环境初始化设置（必须）
BaaS.test = {
  clientID: 'ClientID-v233',
}

global.BaaS._polyfill.checkLatestVersion = () => null // 绕过 SDK 版本检测

global.BaaS.init(BaaS.test.clientID)

// 引入待测试模块
require('./auth')
require('./reportTicket')
