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

// qq
expectType<Promise<QqBaaS.Response<any>>>(OrderQq.get('123456'))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(OrderAlipay.get('123456'))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(OrderBaidu.get('123456'))

// web
expectType<Promise<WebBaaS.Response<any>>>(OrderWeb.get('123456'))


/**
 * Order#getOrderList
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(OrderWechat.getOrderList())
expectType<Promise<WechatBaaS.Response<any>>>(OrderWechat.getOrderList({merchandise_record_id: '123'}))
expectType<Promise<WechatBaaS.Response<any>>>(OrderWechat.getOrderList({merchandise_schema_id: '123'}))
expectType<Promise<WechatBaaS.Response<any>>>(OrderWechat.getOrderList({status: 'pending'}))
expectType<Promise<WechatBaaS.Response<any>>>(OrderWechat.getOrderList({trade_no: '123'}))
expectType<Promise<WechatBaaS.Response<any>>>(OrderWechat.getOrderList({transactionID: '123'}))
expectType<Promise<WechatBaaS.Response<any>>>(OrderWechat.getOrderList({gateway_type: 'weixin_tenpay'}))

// qq
expectType<Promise<QqBaaS.Response<any>>>(OrderQq.getOrderList())
expectType<Promise<QqBaaS.Response<any>>>(OrderQq.getOrderList({merchandise_record_id: '123'}))
expectType<Promise<QqBaaS.Response<any>>>(OrderQq.getOrderList({merchandise_schema_id: '123'}))
expectType<Promise<QqBaaS.Response<any>>>(OrderQq.getOrderList({status: 'pending'}))
expectType<Promise<QqBaaS.Response<any>>>(OrderQq.getOrderList({trade_no: '123'}))
expectType<Promise<QqBaaS.Response<any>>>(OrderQq.getOrderList({transactionID: '123'}))
expectType<Promise<QqBaaS.Response<any>>>(OrderQq.getOrderList({gateway_type: 'weixin_tenpay'}))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(OrderAlipay.getOrderList())
expectType<Promise<AlipayBaaS.Response<any>>>(OrderAlipay.getOrderList({merchandise_record_id: '123'}))
expectType<Promise<AlipayBaaS.Response<any>>>(OrderAlipay.getOrderList({merchandise_schema_id: '123'}))
expectType<Promise<AlipayBaaS.Response<any>>>(OrderAlipay.getOrderList({status: 'pending'}))
expectType<Promise<AlipayBaaS.Response<any>>>(OrderAlipay.getOrderList({trade_no: '123'}))
expectType<Promise<AlipayBaaS.Response<any>>>(OrderAlipay.getOrderList({transactionID: '123'}))
expectType<Promise<AlipayBaaS.Response<any>>>(OrderAlipay.getOrderList({gateway_type: 'weixin_tenpay'}))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(OrderBaidu.getOrderList())
expectType<Promise<BaiduBaaS.Response<any>>>(OrderBaidu.getOrderList({merchandise_record_id: '123'}))
expectType<Promise<BaiduBaaS.Response<any>>>(OrderBaidu.getOrderList({merchandise_schema_id: '123'}))
expectType<Promise<BaiduBaaS.Response<any>>>(OrderBaidu.getOrderList({status: 'pending'}))
expectType<Promise<BaiduBaaS.Response<any>>>(OrderBaidu.getOrderList({trade_no: '123'}))
expectType<Promise<BaiduBaaS.Response<any>>>(OrderBaidu.getOrderList({transactionID: '123'}))
expectType<Promise<BaiduBaaS.Response<any>>>(OrderBaidu.getOrderList({gateway_type: 'weixin_tenpay'}))

// web
expectType<Promise<WebBaaS.Response<any>>>(OrderWeb.getOrderList())
expectType<Promise<WebBaaS.Response<any>>>(OrderWeb.getOrderList({merchandise_record_id: '123'}))
expectType<Promise<WebBaaS.Response<any>>>(OrderWeb.getOrderList({merchandise_schema_id: '123'}))
expectType<Promise<WebBaaS.Response<any>>>(OrderWeb.getOrderList({status: 'pending'}))
expectType<Promise<WebBaaS.Response<any>>>(OrderWeb.getOrderList({trade_no: '123'}))
expectType<Promise<WebBaaS.Response<any>>>(OrderWeb.getOrderList({transactionID: '123'}))
expectType<Promise<WebBaaS.Response<any>>>(OrderWeb.getOrderList({gateway_type: 'weixin_tenpay'}))