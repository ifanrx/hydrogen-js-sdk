'use strict';

if (typeof require !== 'undefined') {
  global.expect = require('chai').expect;
  global.BaaS = require('../src');
  // 模拟 wx 方法
  global.wx = require('./wechat-mock');
}

// BaaS 测试环境初始化设置（必须）
BaaS.test = {
  clientID: 'ClientID-v233',
};

// 引入待测试模块
require('./baas');
require('./content');
require('./schema');
require('./storage');
require('./utils');
require('./request');
