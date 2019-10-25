import {expectType} from 'tsd'

// wechat
let userRecord_1 = new wx.BaaS.UserRecord('123')
expectType<WechatBaaS.BaseRecord>(new wx.BaaS.UserRecord('123') as WechatBaaS.BaseRecord)
expectType<Promise<WechatBaaS.Response<any>>>(userRecord_1.update())

// qq
let userRecord_2 = new qq.BaaS.UserRecord('123')
expectType<QqBaaS.BaseRecord>(new qq.BaaS.UserRecord('123') as QqBaaS.BaseRecord)
expectType<Promise<QqBaaS.Response<any>>>(userRecord_2.update())

// alipay
let userRecord_3 = new my.BaaS.UserRecord('123')
expectType<AlipayBaaS.BaseRecord>(new my.BaaS.UserRecord('123') as AlipayBaaS.BaseRecord)
expectType<Promise<AlipayBaaS.Response<any>>>(userRecord_3.update())

// baidu
let userRecord_4 = new swan.BaaS.UserRecord('123')
expectType<BaiduBaaS.BaseRecord>(new swan.BaaS.UserRecord('123') as BaiduBaaS.BaseRecord)
expectType<Promise<BaiduBaaS.Response<any>>>(userRecord_4.update())

// web
let userRecord_5 = new window.BaaS.UserRecord('123')
expectType<WebBaaS.BaseRecord>(new window.BaaS.UserRecord('123') as WebBaaS.BaseRecord)
expectType<Promise<WebBaaS.Response<any>>>(userRecord_5.update())