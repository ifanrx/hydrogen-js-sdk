var regeneratorRuntime = require('./vendor/async-runtime')

App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)
    wx.BaaS.init('733b59d1b10ff4a37390')

    wx.BaaS.ErrorTracker.enable({usePlugins: true})

    // DEBUG config
    // wx.BaaS._config.DEBUG = true
    // wx.BaaS.init('3290e209ab69819aa7df')
    // wx.BaaS._config.API_HOST = 'https://viac2-p.eng-vm.can.corp.ifanr.com'
    // wx.BaaS._config.API_HOST_PATTERN = /^https:\/\/[\w-.]+\.ifanr\.com/
  },
  onShow: function(options) {
    console.log('onShow')
    wx.BaaS.reportTemplateMsgAnalytics(options)
  },
  onError: function (res) {
    wx.BaaS.ErrorTracker.track(res)
  },
  config: {
    appName: 'sdk',
  },
  regeneratorRuntime,
  get BaaS() {
    return requirePlugin('sdkPlugin')
  }
})
