import {expectType} from 'tsd'

let MyUser_wx = new wx.BaaS.User()
let MyUser_qq = new qq.BaaS.User()
let MyUser_swan = new swan.BaaS.User()
let MyUser_my = new my.BaaS.User()
let MyUser_window = new window.BaaS.User()

/**
 * User#get
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyUser_wx.get('123456'))
// qq
expectType<Promise<QqBaaS.Response<any>>>(MyUser_qq.get('123456'))
// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyUser_swan.get('133456'))
// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyUser_my.get('144456'))
// web
expectType<Promise<WebBaaS.Response<any>>>(MyUser_window.get('155556'))


/**
 * User#find
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyUser_wx.find())
expectType<Promise<WechatBaaS.Response<any>>>(MyUser_wx.find({}))
expectType<Promise<WechatBaaS.Response<any>>>(MyUser_wx.find({withCount: true}))
// qq
expectType<Promise<QqBaaS.Response<any>>>(MyUser_qq.find())
expectType<Promise<QqBaaS.Response<any>>>(MyUser_qq.find({}))
expectType<Promise<QqBaaS.Response<any>>>(MyUser_qq.find({withCount: true}))
// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyUser_swan.find())
expectType<Promise<BaiduBaaS.Response<any>>>(MyUser_swan.find({}))
expectType<Promise<BaiduBaaS.Response<any>>>(MyUser_swan.find({withCount: true}))
// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyUser_my.find())
expectType<Promise<AlipayBaaS.Response<any>>>(MyUser_my.find({}))
expectType<Promise<AlipayBaaS.Response<any>>>(MyUser_my.find({withCount: true}))
// web
expectType<Promise<WebBaaS.Response<any>>>(MyUser_window.find())
expectType<Promise<WebBaaS.Response<any>>>(MyUser_window.find({}))
expectType<Promise<WebBaaS.Response<any>>>(MyUser_window.find({withCount: true}))


/**
 * User#getWithoutData
 */
// wechat
let user_wx = MyUser_wx.getWithoutData('123456')
let currentUser_wx = MyUser_wx.getCurrentUserWithoutData()
expectType<WechatBaaS.UserRecord>(currentUser_wx)
// qq
let user_qq = MyUser_qq.getWithoutData('123456')
let currentUser_qq = MyUser_qq.getCurrentUserWithoutData()
expectType<QqBaaS.UserRecord>(currentUser_qq)
// baidu
let user_swan = MyUser_swan.getWithoutData('133456')
let currentUser_swan = MyUser_swan.getCurrentUserWithoutData()
expectType<BaiduBaaS.UserRecord>(currentUser_swan)
// alipay
let user_my = MyUser_my.getWithoutData('144456')
let currentUser_my = MyUser_my.getCurrentUserWithoutData()
expectType<AlipayBaaS.UserRecord>(currentUser_my)
// web
let user_window = MyUser_window.getWithoutData('155556')
let currentUser_window = MyUser_window.getCurrentUserWithoutData()
expectType<WebBaaS.UserRecord>(currentUser_window)


/**
 * User#count
 */
// wechat
MyUser_wx.count()
  .then(res => expectType<number>(res))

// qq
MyUser_qq.count()
  .then(res => expectType<number>(res))

// alipay
MyUser_my.count()
  .then(res => expectType<number>(res))

// baidu
MyUser_swan.count()
  .then(res => expectType<number>(res))

// web
MyUser_window.count()
  .then(res => expectType<number>(res))


// wechat
expectType<WechatBaaS.BaseQuery>(new wx.BaaS.User() as WechatBaaS.BaseQuery)
expectType<WechatBaaS.UserRecord>(user_wx)

// qq
expectType<QqBaaS.BaseQuery>(new qq.BaaS.User() as QqBaaS.BaseQuery)
expectType<QqBaaS.UserRecord>(user_qq)

// baidu
expectType<BaiduBaaS.BaseQuery>(new swan.BaaS.User() as BaiduBaaS.BaseQuery)
expectType<BaiduBaaS.UserRecord>(user_swan)

// alipay
expectType<AlipayBaaS.BaseQuery>(new my.BaaS.User() as AlipayBaaS.BaseQuery)
expectType<AlipayBaaS.UserRecord>(user_my)

// web
expectType<WebBaaS.BaseQuery>(new window.BaaS.User() as WebBaaS.BaseQuery)
expectType<WebBaaS.UserRecord>(user_window)
