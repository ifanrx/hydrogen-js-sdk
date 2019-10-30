import {expectType} from 'tsd'

/**
 * login
 */
// wechat
wx.BaaS.auth.login({username: 'user', password: '123456'})
wx.BaaS.auth.login({email: 'test@gmail.com', password: '123456'})
wx.BaaS.auth.login({phone: '12345678', password: '123456'})
expectType<Promise<WechatBaaS.CurrentUser>>(wx.BaaS.auth.login({phone: '12345678', password: '123456'}))

// qq
qq.BaaS.auth.login({username: 'user', password: '123456'})
qq.BaaS.auth.login({email: 'test@gmail.com', password: '123456'})
qq.BaaS.auth.login({phone: '12345678', password: '123456'})
expectType<Promise<QqBaaS.CurrentUser>>(qq.BaaS.auth.login({phone: '12345678', password: '123456'}))

// baidu
swan.BaaS.auth.login({username: 'user', password: '123456'})
swan.BaaS.auth.login({email: 'test@gmail.com', password: '123456'})
swan.BaaS.auth.login({phone: '12345678', password: '123456'})
expectType<Promise<BaiduBaaS.CurrentUser>>(swan.BaaS.auth.login({phone: '12345678', password: '123456'}))

// alipay
my.BaaS.auth.login({username: 'user', password: '123456'})
my.BaaS.auth.login({email: 'test@gmail.com', password: '123456'})
my.BaaS.auth.login({phone: '12345678', password: '123456'})
expectType<Promise<AlipayBaaS.CurrentUser>>(my.BaaS.auth.login({phone: '12345678', password: '123456'}))

// web
window.BaaS.auth.login({username: 'user', password: '123456'})
window.BaaS.auth.login({email: 'test@gmail.com', password: '123456'})
window.BaaS.auth.login({phone: '12345678', password: '123456'})
expectType<Promise<WebBaaS.CurrentUser>>(window.BaaS.auth.login({phone: '12345678', password: '123456'}))

/**
 * register
 */
// wechat
wx.BaaS.auth.register({username: 'user', password: '123456'})
wx.BaaS.auth.register({email: 'test@gmail.com', password: '123456'})
wx.BaaS.auth.register({phone: '12345678', password: '123456'})
expectType<Promise<WechatBaaS.CurrentUser>>(wx.BaaS.auth.register({phone: '12345678', password: '123456'}))

// qq
qq.BaaS.auth.register({username: 'user', password: '123456'})
qq.BaaS.auth.register({email: 'test@gmail.com', password: '123456'})
qq.BaaS.auth.register({phone: '12345678', password: '123456'})
expectType<Promise<QqBaaS.CurrentUser>>(qq.BaaS.auth.register({phone: '12345678', password: '123456'}))

// baidu
swan.BaaS.auth.register({username: 'user', password: '123456'})
swan.BaaS.auth.register({email: 'test@gmail.com', password: '123456'})
swan.BaaS.auth.register({phone: '12345678', password: '123456'})
expectType<Promise<BaiduBaaS.CurrentUser>>(qq.BaaS.auth.register({phone: '12345678', password: '123456'}))

// alipay
my.BaaS.auth.register({username: 'user', password: '123456'})
my.BaaS.auth.register({email: 'test@gmail.com', password: '123456'})
my.BaaS.auth.register({phone: '12345678', password: '123456'})
expectType<Promise<AlipayBaaS.CurrentUser>>(my.BaaS.auth.register({phone: '12345678', password: '123456'}))

// web
window.BaaS.auth.register({username: 'user', password: '123456'})
window.BaaS.auth.register({email: 'test@gmail.com', password: '123456'})
window.BaaS.auth.register({phone: '12345678', password: '123456'})
expectType<Promise<WebBaaS.CurrentUser>>(window.BaaS.auth.register({phone: '12345678', password: '123456'}))

/**
 * loginWithSmsVerificationCode
 */
// wechat
wx.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456')
wx.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true})
wx.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true, syncUserProfile: false})
wx.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true, syncUserProfile: false})
  .then(res => expectType<WechatBaaS.CurrentUser>(res))

// qq
qq.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456')
qq.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true})
qq.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true, syncUserProfile: false})
qq.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true, syncUserProfile: false})
  .then(res => expectType<QqBaaS.CurrentUser>(res))

// alipay
my.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456')
my.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true})
my.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true, syncUserProfile: false})
my.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true, syncUserProfile: false})
  .then(res => expectType<AlipayBaaS.CurrentUser>(res))

// baidu
swan.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456')
swan.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true})
swan.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true, syncUserProfile: false})
swan.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true, syncUserProfile: false})
  .then(res => expectType<BaiduBaaS.CurrentUser>(res))

// web
window.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456')
window.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true})
window.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true, syncUserProfile: false})
window.BaaS.auth.loginWithSmsVerificationCode('15000000000', '123456', {createUser: true, syncUserProfile: false})
  .then(res => expectType<WebBaaS.CurrentUser>(res))

/**
 * logout
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.auth.logout())

// qq
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.auth.logout())

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(my.BaaS.auth.logout())

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(swan.BaaS.auth.logout())

// web
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.auth.logout())


/**
 * anonymousLogin
 */
// wechat
expectType<Promise<WechatBaaS.CurrentUser>>(wx.BaaS.auth.anonymousLogin())

// qq
expectType<Promise<QqBaaS.CurrentUser>>(qq.BaaS.auth.anonymousLogin())

// alipay
expectType<Promise<AlipayBaaS.CurrentUser>>(my.BaaS.auth.anonymousLogin())

// baidu
expectType<Promise<BaiduBaaS.CurrentUser>>(swan.BaaS.auth.anonymousLogin())

// web
expectType<Promise<WebBaaS.CurrentUser>>(window.BaaS.auth.anonymousLogin())


/**
 * silentLogin
 */
// wechat
expectType<Promise<WechatBaaS.CurrentUser>>(wx.BaaS.auth.silentLogin())

// qq
expectType<Promise<QqBaaS.CurrentUser>>(qq.BaaS.auth.silentLogin())

// alipay
expectType<Promise<AlipayBaaS.CurrentUser>>(my.BaaS.auth.silentLogin())

// baidu
expectType<Promise<BaiduBaaS.CurrentUser>>(swan.BaaS.auth.silentLogin())

// web
expectType<Promise<WebBaaS.CurrentUser>>(window.BaaS.auth.silentLogin())


/**
 * requestPasswordReset
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.auth.requestPasswordReset({email: 'test@gmail.com'}))

// qq
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.auth.requestPasswordReset({email: 'test@gmail.com'}))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(my.BaaS.auth.requestPasswordReset({email: 'test@gmail.com'}))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(swan.BaaS.auth.requestPasswordReset({email: 'test@gmail.com'}))

// web
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.auth.requestPasswordReset({email: 'test@gmail.com'}))


/**
 * getCurrentUser
 */
// wechat
expectType<Promise<WechatBaaS.CurrentUser>>(wx.BaaS.auth.getCurrentUser())

// qq
expectType<Promise<QqBaaS.CurrentUser>>(qq.BaaS.auth.getCurrentUser())

// alipay
expectType<Promise<AlipayBaaS.CurrentUser>>(my.BaaS.auth.getCurrentUser())

// baidu
expectType<Promise<BaiduBaaS.CurrentUser>>(swan.BaaS.auth.getCurrentUser())

// web
expectType<Promise<WebBaaS.CurrentUser>>(window.BaaS.auth.getCurrentUser())