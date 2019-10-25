import {expectType} from 'tsd'

// wechat
let query_1 = new wx.BaaS.Query()
let baseQuery_1 = new wx.BaaS.BaseQuery()
expectType<WechatBaaS.BaseQuery>(
  baseQuery_1
    .expand('abc')
    .expand(['def', 'ghi'])
    .limit(10)
    .offset(10)
    .orderBy('abc')
    .orderBy(['def', 'ghi'])
    .select('abc')
    .select(['def', 'ghi'])
    .setQuery(query_1))

// qq
let query_2 = new qq.BaaS.Query()
let baseQuery_2 = new qq.BaaS.BaseQuery()
expectType<QqBaaS.BaseQuery>(
  baseQuery_2
    .expand('abc')
    .expand(['def', 'ghi'])
    .limit(20)
    .offset(20)
    .orderBy('abc')
    .orderBy(['def', 'ghi'])
    .select('abc')
    .select(['def', 'ghi'])
    .setQuery(query_2))

// alipay
let query_3 = new my.BaaS.Query()
let baseQuery_3 = new my.BaaS.BaseQuery()
expectType<AlipayBaaS.BaseQuery>(
  baseQuery_3
    .expand('abc')
    .expand(['def', 'ghi'])
    .limit(30)
    .offset(30)
    .orderBy('abc')
    .orderBy(['def', 'ghi'])
    .select('abc')
    .select(['def', 'ghi'])
    .setQuery(query_3))

// baidu
let query_4 = new swan.BaaS.Query()
let baseQuery_4 = new swan.BaaS.BaseQuery()
expectType<BaiduBaaS.BaseQuery>(
  baseQuery_4
    .expand('abc')
    .expand(['def', 'ghi'])
    .limit(40)
    .offset(40)
    .orderBy('abc')
    .orderBy(['def', 'ghi'])
    .select('abc')
    .select(['def', 'ghi'])
    .setQuery(query_4))

// web
let query_5 = new window.BaaS.Query()
let baseQuery_5 = new window.BaaS.BaseQuery()
expectType<WebBaaS.BaseQuery>(
  baseQuery_5
    .expand('abc')
    .expand(['def', 'ghi'])
    .limit(50)
    .offset(50)
    .orderBy('abc')
    .orderBy(['def', 'ghi'])
    .select('abc')
    .select(['def', 'ghi'])
    .setQuery(query_5))