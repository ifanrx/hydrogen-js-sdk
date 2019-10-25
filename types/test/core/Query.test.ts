import {expectType} from 'tsd'

let queryWechat = new wx.BaaS.Query()
let queryQq = new qq.BaaS.Query()
let queryAlipay = new my.BaaS.Query()
let queryBaidu = new swan.BaaS.Query()
let queryWeb = new window.BaaS.Query()

/**
 * Query.and
 */
// wechat
expectType<WechatBaaS.Query>(wx.BaaS.Query.and(queryWechat, queryWechat))

// qq
expectType<QqBaaS.Query>(wx.BaaS.Query.and(queryQq, queryQq))

// alipay
expectType<AlipayBaaS.Query>(wx.BaaS.Query.and(queryAlipay, queryAlipay))

// baidu
expectType<BaiduBaaS.Query>(wx.BaaS.Query.and(queryBaidu, queryBaidu))

// web
expectType<WebBaaS.Query>(wx.BaaS.Query.and(queryWeb, queryWeb))


/**
 * Query.or
 */
// wechat
expectType<WechatBaaS.Query>(wx.BaaS.Query.or(queryWechat, queryWechat))

// qq
expectType<QqBaaS.Query>(wx.BaaS.Query.or(queryQq, queryQq))

// alipay
expectType<AlipayBaaS.Query>(wx.BaaS.Query.or(queryAlipay, queryAlipay))

// baidu
expectType<BaiduBaaS.Query>(wx.BaaS.Query.or(queryBaidu, queryBaidu))

// web
expectType<WebBaaS.Query>(wx.BaaS.Query.or(queryWeb, queryWeb))


/**
 * Query#compare
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.compare('key', '=', 'test'))

// qq
expectType<QqBaaS.Query>(queryQq.compare('key', '=', 'test'))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.compare('key', '=', 'test'))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.compare('key', '=', 'test'))

// web
expectType<WebBaaS.Query>(queryWeb.compare('key', '=', 'test'))



/**
 * Query#contains
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.contains('key', 'test'))

// qq
expectType<QqBaaS.Query>(queryQq.contains('key', 'test'))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.contains('key', 'test'))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.contains('key', 'test'))

// web
expectType<WebBaaS.Query>(queryWeb.contains('key', 'test'))



/**
 * Query#matches
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.matches('key', /test/))

// qq
expectType<QqBaaS.Query>(queryQq.matches('key', /test/))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.matches('key', /test/))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.matches('key', /test/))

// web
expectType<WebBaaS.Query>(queryWeb.matches('key', /test/))



/**
 * Query#in
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.notIn('key', ['a', 'b']))

// qq
expectType<QqBaaS.Query>(queryQq.notIn('key', ['a', 'b']))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.notIn('key', ['a', 'b']))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.notIn('key', ['a', 'b']))

// web
expectType<WebBaaS.Query>(queryWeb.notIn('key', ['a', 'b']))



/**
 * Query#notIn
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.in('key', ['a', 'b']))

// qq
expectType<QqBaaS.Query>(queryQq.in('key', ['a', 'b']))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.in('key', ['a', 'b']))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.in('key', ['a', 'b']))

// web
expectType<WebBaaS.Query>(queryWeb.in('key', ['a', 'b']))



/**
 * Query#arrayContains
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.arrayContains('key', ['a', 'b']))

// qq
expectType<QqBaaS.Query>(queryQq.arrayContains('key', ['a', 'b']))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.arrayContains('key', ['a', 'b']))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.arrayContains('key', ['a', 'b']))

// web
expectType<WebBaaS.Query>(queryWeb.arrayContains('key', ['a', 'b']))



/**
 * Query#isNull
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.isNull('key'))

// qq
expectType<QqBaaS.Query>(queryQq.isNull('key'))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.isNull('key'))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.isNull('key'))

// web
expectType<WebBaaS.Query>(queryWeb.isNull('key'))



/**
 * Query#isNotNull
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.isNotNull('key'))

// qq
expectType<QqBaaS.Query>(queryQq.isNotNull('key'))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.isNotNull('key'))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.isNotNull('key'))

// web
expectType<WebBaaS.Query>(queryWeb.isNotNull('key'))



/**
 * Query#exists
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.exists('key'))

// qq
expectType<QqBaaS.Query>(queryQq.exists('key'))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.exists('key'))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.exists('key'))

// web
expectType<WebBaaS.Query>(queryWeb.exists('key'))



/**
 * Query#notExists
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.notExists('key'))

// qq
expectType<QqBaaS.Query>(queryQq.notExists('key'))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.notExists('key'))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.notExists('key'))

// web
expectType<WebBaaS.Query>(queryWeb.notExists('key'))



/**
 * Query#include
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.include('key', new wx.BaaS.GeoPoint(0, 0)))

// qq
expectType<QqBaaS.Query>(queryQq.include('key', new qq.BaaS.GeoPoint(0, 0)))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.include('key', new my.BaaS.GeoPoint(0, 0)))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.include('key', new swan.BaaS.GeoPoint(0, 0)))

// web
expectType<WebBaaS.Query>(queryWeb.include('key', new window.BaaS.GeoPoint(0, 0)))



/**
 * Query#within
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.within('key', new wx.BaaS.GeoPolygon([])))

// qq
expectType<QqBaaS.Query>(queryQq.within('key', new qq.BaaS.GeoPolygon([])))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.within('key', new my.BaaS.GeoPolygon([])))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.within('key', new swan.BaaS.GeoPolygon([])))

// web
expectType<WebBaaS.Query>(queryWeb.within('key', new window.BaaS.GeoPolygon([])))



/**
 * Query#withinCircle
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.withinCircle('key', new wx.BaaS.GeoPoint(0, 0), 1))

// qq
expectType<QqBaaS.Query>(queryQq.withinCircle('key', new qq.BaaS.GeoPoint(0, 0), 1))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.withinCircle('key', new my.BaaS.GeoPoint(0, 0), 1))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.withinCircle('key', new swan.BaaS.GeoPoint(0, 0), 1))

// web
expectType<WebBaaS.Query>(queryWeb.withinCircle('key', new window.BaaS.GeoPoint(0, 0), 1))



/**
 * Query#withinRegion
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.withinRegion('key', new wx.BaaS.GeoPoint(0, 0), 1))
expectType<WechatBaaS.Query>(queryWechat.withinRegion('key', new wx.BaaS.GeoPoint(0, 0), 10, 1))

// qq
expectType<QqBaaS.Query>(queryQq.withinRegion('key', new qq.BaaS.GeoPoint(0, 0), 1))
expectType<QqBaaS.Query>(queryQq.withinRegion('key', new qq.BaaS.GeoPoint(0, 0), 10, 1))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.withinRegion('key', new my.BaaS.GeoPoint(0, 0), 1))
expectType<AlipayBaaS.Query>(queryAlipay.withinRegion('key', new my.BaaS.GeoPoint(0, 0), 10, 1))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.withinRegion('key', new swan.BaaS.GeoPoint(0, 0), 1))
expectType<BaiduBaaS.Query>(queryBaidu.withinRegion('key', new swan.BaaS.GeoPoint(0, 0), 10, 1))

// web
expectType<WebBaaS.Query>(queryWeb.withinRegion('key', new window.BaaS.GeoPoint(0, 0), 1))
expectType<WebBaaS.Query>(queryWeb.withinRegion('key', new window.BaaS.GeoPoint(0, 0), 10, 1))



/**
 * Query#hasKey
 */
// wechat
expectType<WechatBaaS.Query>(queryWechat.hasKey('key', 'test'))

// qq
expectType<QqBaaS.Query>(queryQq.hasKey('key', 'test'))

// alipay
expectType<AlipayBaaS.Query>(queryAlipay.hasKey('key', 'test'))

// baidu
expectType<BaiduBaaS.Query>(queryBaidu.hasKey('key', 'test'))

// web
expectType<WebBaaS.Query>(queryWeb.hasKey('key', 'test'))