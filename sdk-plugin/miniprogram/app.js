var regeneratorRuntime = require('./vendor/async-runtime')

App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment)
    wx.BaaS.init('733b59d1b10ff4a37390')

    wx.BaaS.ErrorTracker.enable({usePlugins: true})
  },
  onShow: function(options) {
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
