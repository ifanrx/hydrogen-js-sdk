import {expectType} from 'tsd'

let MyFileCategoryWechat = new wx.BaaS.FileCategory()
let MyFileCategoryQq = new qq.BaaS.FileCategory()
let MyFileCategoryAlipay = new my.BaaS.FileCategory()
let MyFileCategoryBaidu = new swan.BaaS.FileCategory()
let MyFileCategoryWeb = new window.BaaS.FileCategory()
/**
 * constructor
 */
// wechat
expectType<WechatBaaS.BaseQuery>(MyFileCategoryWechat as WechatBaaS.BaseQuery)

// qq
expectType<QqBaaS.BaseQuery>(MyFileCategoryQq as QqBaaS.BaseQuery)

// alipay
expectType<AlipayBaaS.BaseQuery>(MyFileCategoryAlipay as AlipayBaaS.BaseQuery)

// baidu
expectType<BaiduBaaS.BaseQuery>(MyFileCategoryBaidu as BaiduBaaS.BaseQuery)

// web
expectType<WebBaaS.BaseQuery>(MyFileCategoryWeb as WebBaaS.BaseQuery)


/**
 * FileCategory#get
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyFileCategoryWechat.get('123456'))

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyFileCategoryQq.get('123456'))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileCategoryAlipay.get('123456'))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileCategoryBaidu.get('123456'))

// web
expectType<Promise<WebBaaS.Response<any>>>(MyFileCategoryWeb.get('123456'))


/**
 * FileCategory#getFileList
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyFileCategoryWechat.getFileList('123456'))

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyFileCategoryQq.getFileList('123456'))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileCategoryAlipay.getFileList('123456'))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileCategoryBaidu.getFileList('123456'))

// web
expectType<Promise<WebBaaS.Response<any>>>(MyFileCategoryWeb.getFileList('123456'))


/**
 * FileCategory#find
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyFileCategoryWechat.find())

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyFileCategoryQq.find())

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileCategoryAlipay.find())

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileCategoryBaidu.find())

// web
expectType<Promise<WebBaaS.Response<any>>>(MyFileCategoryWeb.find())