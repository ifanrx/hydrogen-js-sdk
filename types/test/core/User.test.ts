import {expectType} from 'tsd'

// wechat
expectType<WechatBaaS.BaseQuery>(new wx.BaaS.User() as WechatBaaS.BaseQuery)
let MyUser_1 = new wx.BaaS.User()
expectType<Promise<WechatBaaS.Response<any>>>(MyUser_1.get('123456'))
expectType<Promise<WechatBaaS.Response<any>>>(MyUser_1.find())
let user_1 = MyUser_1.getWithoutData('123456')
expectType<WechatBaaS.UserRecord>(user_1)
let currentUser_1 = MyUser_1.getCurrentUserWithoutData()
expectType<WechatBaaS.UserRecord>(currentUser_1)

// qq
expectType<QqBaaS.BaseQuery>(new qq.BaaS.User() as QqBaaS.BaseQuery)
let MyUser_2 = new qq.BaaS.User()
expectType<Promise<QqBaaS.Response<any>>>(MyUser_2.get('123456'))
expectType<Promise<QqBaaS.Response<any>>>(MyUser_2.find())
let user_2 = MyUser_2.getWithoutData('123456')
expectType<QqBaaS.UserRecord>(user_2)
let currentUser_2 = MyUser_2.getCurrentUserWithoutData()
expectType<QqBaaS.UserRecord>(currentUser_2)

// baidu
expectType<BaiduBaaS.BaseQuery>(new swan.BaaS.User() as BaiduBaaS.BaseQuery)
let MyUser_3 = new swan.BaaS.User()
expectType<Promise<BaiduBaaS.Response<any>>>(MyUser_3.get('133456'))
expectType<Promise<BaiduBaaS.Response<any>>>(MyUser_3.find())
let user_3 = MyUser_3.getWithoutData('133456')
expectType<BaiduBaaS.UserRecord>(user_3)
let currentUser_3 = MyUser_3.getCurrentUserWithoutData()
expectType<BaiduBaaS.UserRecord>(currentUser_3)

// alipay
expectType<AlipayBaaS.BaseQuery>(new my.BaaS.User() as AlipayBaaS.BaseQuery)
let MyUser_4 = new my.BaaS.User()
expectType<Promise<AlipayBaaS.Response<any>>>(MyUser_4.get('144456'))
expectType<Promise<AlipayBaaS.Response<any>>>(MyUser_4.find())
let user_4 = MyUser_4.getWithoutData('144456')
expectType<AlipayBaaS.UserRecord>(user_4)
let currentUser_4 = MyUser_4.getCurrentUserWithoutData()
expectType<AlipayBaaS.UserRecord>(currentUser_4)

// web
expectType<WebBaaS.BaseQuery>(new window.BaaS.User() as WebBaaS.BaseQuery)
let MyUser_5 = new window.BaaS.User()
expectType<Promise<WebBaaS.Response<any>>>(MyUser_5.get('155556'))
expectType<Promise<WebBaaS.Response<any>>>(MyUser_5.find())
let user_5 = MyUser_5.getWithoutData('155556')
expectType<WebBaaS.UserRecord>(user_5)
let currentUser_5 = MyUser_5.getCurrentUserWithoutData()
expectType<WebBaaS.UserRecord>(currentUser_5)