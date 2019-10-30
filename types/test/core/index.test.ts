import {expectType} from 'tsd'

/**
 * wechat
 */
wx.BaaS.init('1234567')
wx.BaaS.init('1234567', {autoLogin: false})
wx.BaaS.init('1234567', {logLevel: 'info'})
wx.BaaS.init('1234567', {autoLogin: false, logLevel: 'info'})
wx.BaaS.init('1234567', {host: 'http://****'})
wx.BaaS.init('1234567', {autoLogin: false, logLevel: 'info', host: 'http://****'})

wx.BaaS.invoke('function')
wx.BaaS.invoke('function', {a: 10, b: 20})
wx.BaaS.invoke('function', {a: 10, b: 20}, true)
  .then(res => expectType<WechatBaaS.Response<any>>(res))

wx.BaaS.clearSession()
wx.BaaS.checkVersion({platform: 'wechat', onSuccess: () => {}, onError: () => {}})
expectType<string>(wx.BaaS.getAuthToken())


/**
 * qq
 */
qq.BaaS.init('1234567')
qq.BaaS.init('1234567', {autoLogin: false})
qq.BaaS.init('1234567', {logLevel: 'info'})
qq.BaaS.init('1234567', {autoLogin: false, logLevel: 'info'})
qq.BaaS.init('1234567', {host: 'http://****'})
qq.BaaS.init('1234567', {autoLogin: false, logLevel: 'info', host: 'http://****'})

qq.BaaS.invoke('function')
qq.BaaS.invoke('function', {a: 10, b: 20})
qq.BaaS.invoke('function', {a: 10, b: 20}, true)
  .then(res => expectType<QqBaaS.Response<any>>(res))

qq.BaaS.clearSession()
qq.BaaS.checkVersion({platform: 'wechat', onSuccess: () => {}, onError: () => {}})
expectType<string>(qq.BaaS.getAuthToken())


/**
 * alipay
 */
my.BaaS.init('1234567')
my.BaaS.init('1234567', {autoLogin: false})
my.BaaS.init('1234567', {logLevel: 'info'})
my.BaaS.init('1234567', {autoLogin: false, logLevel: 'info'})
my.BaaS.init('1234567', {host: 'http://****'})
my.BaaS.init('1234567', {autoLogin: false, logLevel: 'info', host: 'http://****'})

my.BaaS.invoke('function')
my.BaaS.invoke('function', {a: 10, b: 20})
my.BaaS.invoke('function', {a: 10, b: 20}, true)
  .then(res => expectType<AlipayBaaS.Response<any>>(res))

my.BaaS.clearSession()
my.BaaS.checkVersion({platform: 'wechat', onSuccess: () => {}, onError: () => {}})
expectType<string>(my.BaaS.getAuthToken())


/**
 * baidu
 */
swan.BaaS.init('1234567')
swan.BaaS.init('1234567', {autoLogin: false})
swan.BaaS.init('1234567', {logLevel: 'info'})
swan.BaaS.init('1234567', {autoLogin: false, logLevel: 'info'})
swan.BaaS.init('1234567', {host: 'http://****'})
swan.BaaS.init('1234567', {autoLogin: false, logLevel: 'info', host: 'http://****'})

swan.BaaS.invoke('function')
swan.BaaS.invoke('function', {a: 10, b: 20})
swan.BaaS.invoke('function', {a: 10, b: 20}, true)
  .then(res => expectType<BaiduBaaS.Response<any>>(res))

swan.BaaS.clearSession()
swan.BaaS.checkVersion({platform: 'wechat', onSuccess: () => {}, onError: () => {}})
expectType<string>(swan.BaaS.getAuthToken())


/**
 * web
 */
window.BaaS.init('1234567')
window.BaaS.init('1234567', {autoLogin: false})
window.BaaS.init('1234567', {logLevel: 'info'})
window.BaaS.init('1234567', {autoLogin: false, logLevel: 'info'})
window.BaaS.init('1234567', {host: 'http://****'})
window.BaaS.init('1234567', {autoLogin: false, logLevel: 'info', host: 'http://****'})

window.BaaS.invoke('function')
window.BaaS.invoke('function', {a: 10, b: 20})
window.BaaS.invoke('function', {a: 10, b: 20}, true)
  .then(res => expectType<WebBaaS.Response<any>>(res))

window.BaaS.clearSession()
window.BaaS.checkVersion({platform: 'wechat', onSuccess: () => {}, onError: () => {}})
expectType<string>(window.BaaS.getAuthToken())
