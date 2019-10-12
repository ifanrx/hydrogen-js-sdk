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