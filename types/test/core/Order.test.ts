import {expectType} from 'tsd'

let OrderWechat = new wx.BaaS.Order()
let OrderQq = new qq.BaaS.Order()
let OrderAlipay = new my.BaaS.Order()
let OrderBaidu = new swan.BaaS.Order()
let OrderWeb = new window.BaaS.Order()

/**
 * constructor
 */
// wechat
expectType<WechatBaaS.BaseQuery>(OrderWechat as WechatBaaS.BaseQuery)

// qq
expectType<QqBaaS.BaseQuery>(OrderQq as QqBaaS.BaseQuery)

// alipay
expectType<AlipayBaaS.BaseQuery>(OrderAlipay as AlipayBaaS.BaseQuery)

// baidu
expectType<BaiduBaaS.BaseQuery>(OrderBaidu as BaiduBaaS.BaseQuery)

// web
expectType<WebBaaS.BaseQuery>(OrderWeb as WebBaaS.BaseQuery)


/**
 * Order#get
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(OrderWechat.get('123456'))