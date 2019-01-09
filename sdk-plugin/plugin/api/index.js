const BaaS = require('./baas')
const core = require('./core')

BaaS.use(core)

// 暴露 BaaS 到小程序环境
if (typeof wx !== 'undefined') {
  wx.BaaS = BaaS
}

module.exports = BaaS
