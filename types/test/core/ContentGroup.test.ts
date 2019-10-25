import {expectType} from 'tsd'

let MyContentGroupWechat = new wx.BaaS.ContentGroup('123')
let MyContentGroupQq = new qq.BaaS.ContentGroup('123')
let MyContentGroupAlipay = new my.BaaS.ContentGroup('123')
let MyContentGroupBaidu = new swan.BaaS.ContentGroup('123')
let MyContentGroupWeb = new window.BaaS.ContentGroup('123')

/**
 * constructor
 */
// wechat
expectType<WechatBaaS.BaseQuery>(MyContentGroupWechat as WechatBaaS.BaseQuery)

// qq
expectType<QqBaaS.BaseQuery>(MyContentGroupQq as QqBaaS.BaseQuery)

// alipay
expectType<AlipayBaaS.BaseQuery>(MyContentGroupAlipay as AlipayBaaS.BaseQuery)

// baidu
expectType<BaiduBaaS.BaseQuery>(MyContentGroupBaidu as BaiduBaaS.BaseQuery)

// web
expectType<WebBaaS.BaseQuery>(MyContentGroupWeb as WebBaaS.BaseQuery)


/**
 * ContentGroup#getContent
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyContentGroupWechat.getContent('123456'))

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyContentGroupQq.getContent('123456'))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyContentGroupAlipay.getContent('123456'))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.getContent('123456'))

// web
expectType<Promise<WebBaaS.Response<any>>>(MyContentGroupWeb.getContent('123456'))


/**
 * ContentGroup#find
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyContentGroupWechat.find())

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyContentGroupQq.find())

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyContentGroupAlipay.find())

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.find())

// web
expectType<Promise<WebBaaS.Response<any>>>(MyContentGroupWeb.find())


/**
 * ContentGroup#getCategoryList
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyContentGroupWechat.getCategoryList())

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyContentGroupQq.getCategoryList())

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyContentGroupAlipay.getCategoryList())

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.getCategoryList())

// web
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.getCategoryList())


/**
 * ContentGroup#getCategory
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyContentGroupWechat.getCategoryList())

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyContentGroupQq.getCategoryList())

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyContentGroupAlipay.getCategoryList())

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.getCategoryList())

// web
expectType<Promise<WebBaaS.Response<any>>>(MyContentGroupWeb.getCategoryList())