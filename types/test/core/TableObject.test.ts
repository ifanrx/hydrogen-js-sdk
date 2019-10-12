import {expectType} from 'tsd'

// wechat
let tableObject_1 = new wx.BaaS.TableObject('123')
tableObject_1.createMany([{a: 10}, {b: 20}])
tableObject_1.createMany([{a: 10}, {b: 20}], {enableTrigger: false})
  .then(res => expectType<WechatBaaS.Response<any>>(res))
tableObject_1.delete('123')
tableObject_1.delete(new wx.BaaS.Query())
tableObject_1.delete(new wx.BaaS.Query(), {enableTrigger: true})
  .then(res => expectType<WechatBaaS.Response<any>>(res))
tableObject_1.getWithoutData(new wx.BaaS.Query())
tableObject_1.get('123')
  .then(res => expectType<WechatBaaS.Response<any>>(res))
tableObject_1.find()
  .then(res => expectType<WechatBaaS.Response<any>>(res))
tableObject_1.count()
  .then(res => expectType<number>(res))
expectType<WechatBaaS.BaseQuery>(tableObject_1 as WechatBaaS.BaseQuery)
expectType<WechatBaaS.TableRecord>(tableObject_1.create())
expectType<WechatBaaS.TableRecord>(tableObject_1.getWithoutData('123'))

// qq
let tableObject_2 = new qq.BaaS.TableObject('123')
tableObject_2.createMany([{a: 10}, {b: 20}])
tableObject_2.createMany([{a: 10}, {b: 20}], {enableTrigger: false})
  .then(res => expectType<QqBaaS.Response<any>>(res))
tableObject_2.delete('123')
tableObject_2.delete(new qq.BaaS.Query())
tableObject_2.delete(new qq.BaaS.Query(), {enableTrigger: true})
  .then(res => expectType<QqBaaS.Response<any>>(res))
tableObject_2.getWithoutData(new qq.BaaS.Query())
tableObject_2.get('123')
  .then(res => expectType<QqBaaS.Response<any>>(res))
tableObject_2.find()
  .then(res => expectType<QqBaaS.Response<any>>(res))
tableObject_2.count()
  .then(res => expectType<number>(res))
expectType<QqBaaS.BaseQuery>(tableObject_2 as QqBaaS.BaseQuery)
expectType<QqBaaS.TableRecord>(tableObject_2.create())
expectType<QqBaaS.TableRecord>(tableObject_2.getWithoutData('123'))

// alipay
let tableObject_3 = new my.BaaS.TableObject('123')
tableObject_3.createMany([{a: 10}, {b: 20}])
tableObject_3.createMany([{a: 10}, {b: 20}], {enableTrigger: false})
  .then(res => expectType<AlipayBaaS.Response<any>>(res))
tableObject_3.delete('123')
tableObject_3.delete(new my.BaaS.Query())
tableObject_3.delete(new my.BaaS.Query(), {enableTrigger: true})
  .then(res => expectType<AlipayBaaS.Response<any>>(res))
tableObject_3.getWithoutData(new my.BaaS.Query())
tableObject_3.get('123')
  .then(res => expectType<AlipayBaaS.Response<any>>(res))
tableObject_3.find()
  .then(res => expectType<AlipayBaaS.Response<any>>(res))
tableObject_3.count()
  .then(res => expectType<number>(res))
expectType<AlipayBaaS.BaseQuery>(tableObject_3 as AlipayBaaS.BaseQuery)
expectType<AlipayBaaS.TableRecord>(tableObject_3.create())
expectType<AlipayBaaS.TableRecord>(tableObject_3.getWithoutData('123'))

// baidu
let tableObject_4 = new swan.BaaS.TableObject('123')
tableObject_4.createMany([{a: 10}, {b: 20}])
tableObject_4.createMany([{a: 10}, {b: 20}], {enableTrigger: false})
  .then(res => expectType<BaiduBaaS.Response<any>>(res))
tableObject_4.delete('123')
tableObject_4.delete(new swan.BaaS.Query())
tableObject_4.delete(new swan.BaaS.Query(), {enableTrigger: true})
  .then(res => expectType<BaiduBaaS.Response<any>>(res))
tableObject_4.getWithoutData(new swan.BaaS.Query())
tableObject_4.get('123')
  .then(res => expectType<BaiduBaaS.Response<any>>(res))
tableObject_4.find()
  .then(res => expectType<BaiduBaaS.Response<any>>(res))
tableObject_4.count()
  .then(res => expectType<number>(res))
expectType<BaiduBaaS.BaseQuery>(tableObject_4 as BaiduBaaS.BaseQuery)
expectType<BaiduBaaS.TableRecord>(tableObject_4.create())
expectType<BaiduBaaS.TableRecord>(tableObject_4.getWithoutData('123'))

// web
let tableObject_5 = new window.BaaS.TableObject('123')
tableObject_5.createMany([{a: 10}, {b: 20}])
tableObject_5.createMany([{a: 10}, {b: 20}], {enableTrigger: false})
  .then(res => expectType<WebBaaS.Response<any>>(res))
tableObject_5.delete('123')
tableObject_5.delete(new window.BaaS.Query())
tableObject_5.delete(new window.BaaS.Query(), {enableTrigger: true})
  .then(res => expectType<WebBaaS.Response<any>>(res))
tableObject_5.getWithoutData(new window.BaaS.Query())
tableObject_5.get('123')
  .then(res => expectType<WebBaaS.Response<any>>(res))
tableObject_5.find()
  .then(res => expectType<WebBaaS.Response<any>>(res))
tableObject_5.count()
  .then(res => expectType<number>(res))
expectType<WebBaaS.BaseQuery>(tableObject_5 as WebBaaS.BaseQuery)
expectType<WebBaaS.TableRecord>(tableObject_5.create())
expectType<WebBaaS.TableRecord>(tableObject_5.getWithoutData('123'))