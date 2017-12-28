'use strict'

if (typeof require !== 'undefined') {
  global.expect = require('chai').expect
  global.rewire = require('rewire')
  global.BaaS = require('../src')
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

// 引入待测试模块
require('./BaseQuery')
require('./baasRequest')
require('./Content')
require('./File')
require('./FileCategory')
require('./GeoPoint')
require('./GeoPolygon')
require('./Query')
require('./request')
require('./storage')
require('./TableObject')
require('./templateMessage')
require('./templateMessage')
require('./utils')
require('./wxDecryptData')
