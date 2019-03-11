'use strict'

if (typeof require !== 'undefined') {
  global.expect = require('chai').expect

  // 为了兼容 webpack alias 与 DefinePlugin
  global.__VERSION_WECHAT__ = 'v1.0.0'
  const moduleAlias = require('module-alias')
  moduleAlias.addAlias('core-module', __dirname + '../../../core')

  let BaaS = require('../../sdk-file/src/wechat')
  global.BaaS = BaaS

  // 模拟 wx 方法
  global.wx = require('./wechat-mock')

  const sinon = require('sinon')
  const sinonStubPromise = require('sinon-stub-promise')
  sinonStubPromise(sinon)
  global.sinon = sinon
}

// BaaS 测试环境初始化设置（必须）
BaaS.test = {
  clientID: 'ClientID-v233',
}

global.BaaS._polyfill.checkLatestVersion = () => null // 绕过 SDK 版本检测

global.BaaS.init(BaaS.test.clientID)

// 引入待测试模块
require('../core/BaseQuery')
require('../core/BaseRecord')
require('../core/ContentGroup')
require('../core/File')
require('../core/FileCategory')
require('../core/GeoPoint')
require('../core/GeoPolygon')
require('../core/Query')
require('../core/storage')
require('../core/TableObject')
require('../core/TableRecord')
require('../core/User')
require('../core/UserRecord')
require('../core/utils')
require('./auth')
require('./baasRequest')
require('./getWXACode')
require('./Order')
require('./templateMessage')
require('./wxDecryptData')
