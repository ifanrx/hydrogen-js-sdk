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
require('./baas')
require('./content')
require('./geoPoint')
require('./geoPolygon')
require('./query')
require('./request')
require('./schema')
require('./storage')
require('./tableObject')
require('./utils')
require('./templateMessage')
require('./templateMessage')
require('./wxDecryptData')
