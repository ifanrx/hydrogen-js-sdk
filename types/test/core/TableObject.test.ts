import {expectType} from 'tsd'

let tableObject_wx = new wx.BaaS.TableObject('123')
let tableObject_qq = new qq.BaaS.TableObject('123')
let tableObject_my = new my.BaaS.TableObject('123')
let tableObject_swan = new swan.BaaS.TableObject('123')
let tableObject_window = new window.BaaS.TableObject('123')

/**
 * TableObject#createMany
 */
// wechat
tableObject_wx.createMany([{a: 10}, {b: 20}])
tableObject_wx.createMany([{a: 10}, {b: 20}], {})
tableObject_wx.createMany([{a: 10}, {b: 20}], {enableTrigger: false})
  .then(res => expectType<WechatBaaS.Response<any>>(res))

// qq
tableObject_qq.createMany([{a: 10}, {b: 20}])
tableObject_qq.createMany([{a: 10}, {b: 20}], {})
tableObject_qq.createMany([{a: 10}, {b: 20}], {enableTrigger: false})
  .then(res => expectType<QqBaaS.Response<any>>(res))

// alipay
tableObject_my.createMany([{a: 10}, {b: 20}])
tableObject_my.createMany([{a: 10}, {b: 20}], {})
tableObject_my.createMany([{a: 10}, {b: 20}], {enableTrigger: false})
  .then(res => expectType<AlipayBaaS.Response<any>>(res))

// baidu
tableObject_swan.createMany([{a: 10}, {b: 20}])
tableObject_swan.createMany([{a: 10}, {b: 20}], {})
tableObject_swan.createMany([{a: 10}, {b: 20}], {enableTrigger: false})
  .then(res => expectType<BaiduBaaS.Response<any>>(res))

// web
tableObject_window.createMany([{a: 10}, {b: 20}])
tableObject_window.createMany([{a: 10}, {b: 20}], {})
tableObject_window.createMany([{a: 10}, {b: 20}], {enableTrigger: false})
  .then(res => expectType<WebBaaS.Response<any>>(res))


/**
 * TableObject#delete
 */
// wechat
tableObject_wx.delete('123')
tableObject_wx.delete(new wx.BaaS.Query())
tableObject_wx.delete(new wx.BaaS.Query(), {})
tableObject_wx.delete(new wx.BaaS.Query(), {enableTrigger: true})
tableObject_wx.delete(new wx.BaaS.Query(), {withCount: true})
tableObject_wx.delete(new wx.BaaS.Query(), {enableTrigger: true, withCount: true})
  .then(res => expectType<WechatBaaS.Response<any>>(res))

// qq
tableObject_qq.delete('123')
tableObject_qq.delete(new qq.BaaS.Query())
tableObject_qq.delete(new qq.BaaS.Query(), {})
tableObject_qq.delete(new qq.BaaS.Query(), {enableTrigger: true})
tableObject_qq.delete(new qq.BaaS.Query(), {withCount: true})
tableObject_qq.delete(new qq.BaaS.Query(), {enableTrigger: true, withCount: true})
  .then(res => expectType<QqBaaS.Response<any>>(res))

// alipay
tableObject_my.delete('123')
tableObject_my.delete(new my.BaaS.Query())
tableObject_my.delete(new my.BaaS.Query(), {})
tableObject_my.delete(new my.BaaS.Query(), {enableTrigger: true})
tableObject_my.delete(new my.BaaS.Query(), {withCount: true})
tableObject_my.delete(new my.BaaS.Query(), {enableTrigger: true, withCount: true})
  .then(res => expectType<AlipayBaaS.Response<any>>(res))

// baidu
tableObject_swan.delete('123')
tableObject_swan.delete(new swan.BaaS.Query())
tableObject_swan.delete(new swan.BaaS.Query(), {})
tableObject_swan.delete(new swan.BaaS.Query(), {enableTrigger: true})
tableObject_swan.delete(new swan.BaaS.Query(), {withCount: true})
tableObject_swan.delete(new swan.BaaS.Query(), {enableTrigger: true, withCount: true})
  .then(res => expectType<BaiduBaaS.Response<any>>(res))

// web
tableObject_window.delete('123')
tableObject_window.delete(new window.BaaS.Query())
tableObject_window.delete(new window.BaaS.Query(), {})
tableObject_window.delete(new window.BaaS.Query(), {enableTrigger: true})
tableObject_window.delete(new window.BaaS.Query(), {withCount: true})
tableObject_window.delete(new window.BaaS.Query(), {enableTrigger: true, withCount: true})
  .then(res => expectType<WebBaaS.Response<any>>(res))


/**
 * TableObject#getWithoutData
 */
// wechat
tableObject_wx.getWithoutData(new wx.BaaS.Query())
expectType<WechatBaaS.TableRecord>(tableObject_wx.getWithoutData('123'))

// qq
tableObject_qq.getWithoutData(new qq.BaaS.Query())
expectType<QqBaaS.TableRecord>(tableObject_qq.getWithoutData('123'))

// alipay
tableObject_my.getWithoutData(new my.BaaS.Query())
expectType<AlipayBaaS.TableRecord>(tableObject_my.getWithoutData('123'))
// baidu
tableObject_swan.getWithoutData(new swan.BaaS.Query())
expectType<BaiduBaaS.TableRecord>(tableObject_swan.getWithoutData('123'))
// web
tableObject_window.getWithoutData(new window.BaaS.Query())
expectType<WebBaaS.TableRecord>(tableObject_window.getWithoutData('123'))


/**
 * TableObject#get
 */
// wechat
tableObject_wx.get('123')
  .then(res => expectType<WechatBaaS.Response<any>>(res))
// qq
tableObject_qq.get('123')
  .then(res => expectType<QqBaaS.Response<any>>(res))
// alipay
tableObject_my.get('123')
  .then(res => expectType<AlipayBaaS.Response<any>>(res))
// baidu
tableObject_swan.get('123')
  .then(res => expectType<BaiduBaaS.Response<any>>(res))
// web
tableObject_window.get('123')
  .then(res => expectType<WebBaaS.Response<any>>(res))


/**
 * TableObject#find
 */
// wechat
tableObject_wx.find({})
tableObject_wx.find({withCount: true})
tableObject_wx.find()
  .then(res => expectType<WechatBaaS.Response<any>>(res))

// qq
tableObject_qq.find()
tableObject_qq.find({})
tableObject_qq.find({withCount: true})
  .then(res => expectType<QqBaaS.Response<any>>(res))

// alipay
tableObject_my.find()
tableObject_my.find({})
tableObject_my.find({withCount: true})
  .then(res => expectType<AlipayBaaS.Response<any>>(res))

// baidu
tableObject_swan.find()
tableObject_swan.find({})
tableObject_swan.find({withCount: true})
  .then(res => expectType<BaiduBaaS.Response<any>>(res))

// web
tableObject_window.find()
tableObject_window.find({})
tableObject_window.find({withCount: true})
  .then(res => expectType<WebBaaS.Response<any>>(res))


/**
 * TableObject#create
 */
// wechat
expectType<WechatBaaS.TableRecord>(tableObject_wx.create())

// qq
expectType<QqBaaS.TableRecord>(tableObject_qq.create())

// alipay
expectType<AlipayBaaS.TableRecord>(tableObject_my.create())

// baidu
expectType<BaiduBaaS.TableRecord>(tableObject_swan.create())

// web
expectType<WebBaaS.TableRecord>(tableObject_window.create())


/**
 * TableObject#count
 */
// wechat
tableObject_wx.count()
  .then(res => expectType<number>(res))

// qq
tableObject_qq.count()
  .then(res => expectType<number>(res))

// alipay
tableObject_my.count()
  .then(res => expectType<number>(res))

// baidu
tableObject_swan.count()
  .then(res => expectType<number>(res))

// web
tableObject_window.count()
  .then(res => expectType<number>(res))



// wechat
expectType<WechatBaaS.BaseQuery>(tableObject_wx as WechatBaaS.BaseQuery)

// qq
expectType<QqBaaS.BaseQuery>(tableObject_qq as QqBaaS.BaseQuery)

// alipay
expectType<AlipayBaaS.BaseQuery>(tableObject_my as AlipayBaaS.BaseQuery)

// baidu
expectType<BaiduBaaS.BaseQuery>(tableObject_swan as BaiduBaaS.BaseQuery)

// web
expectType<WebBaaS.BaseQuery>(tableObject_window as WebBaaS.BaseQuery)
