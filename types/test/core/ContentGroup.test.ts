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
expectType<Promise<WechatBaaS.Response<any>>>(MyContentGroupWechat.find({}))
expectType<Promise<WechatBaaS.Response<any>>>(MyContentGroupWechat.find({withCount: true}))

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyContentGroupQq.find())
expectType<Promise<QqBaaS.Response<any>>>(MyContentGroupQq.find({}))
expectType<Promise<QqBaaS.Response<any>>>(MyContentGroupQq.find({withCount: true}))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyContentGroupAlipay.find())
expectType<Promise<AlipayBaaS.Response<any>>>(MyContentGroupAlipay.find({}))
expectType<Promise<AlipayBaaS.Response<any>>>(MyContentGroupAlipay.find({withCount: true}))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.find())
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.find({}))
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.find({withCount: true}))

// web
expectType<Promise<WebBaaS.Response<any>>>(MyContentGroupWeb.find())
expectType<Promise<WebBaaS.Response<any>>>(MyContentGroupWeb.find({}))
expectType<Promise<WebBaaS.Response<any>>>(MyContentGroupWeb.find({withCount: true}))


/**
 * ContentGroup#getCategoryList
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyContentGroupWechat.getCategoryList())
expectType<Promise<WechatBaaS.Response<any>>>(MyContentGroupWechat.getCategoryList({}))
expectType<Promise<WechatBaaS.Response<any>>>(MyContentGroupWechat.getCategoryList({withCount: true}))

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyContentGroupQq.getCategoryList())
expectType<Promise<QqBaaS.Response<any>>>(MyContentGroupQq.getCategoryList({}))
expectType<Promise<QqBaaS.Response<any>>>(MyContentGroupQq.getCategoryList({withCount: true}))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyContentGroupAlipay.getCategoryList())
expectType<Promise<AlipayBaaS.Response<any>>>(MyContentGroupAlipay.getCategoryList({}))
expectType<Promise<AlipayBaaS.Response<any>>>(MyContentGroupAlipay.getCategoryList({withCount: true}))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.getCategoryList())
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.getCategoryList({}))
expectType<Promise<BaiduBaaS.Response<any>>>(MyContentGroupBaidu.getCategoryList({withCount: true}))

// web
expectType<Promise<WebBaaS.Response<any>>>(MyContentGroupWeb.getCategoryList())
expectType<Promise<WebBaaS.Response<any>>>(MyContentGroupWeb.getCategoryList({}))
expectType<Promise<WebBaaS.Response<any>>>(MyContentGroupWeb.getCategoryList({withCount: true}))

/**
 * BaaS.ContentGroup#count
 */
// wechat
MyContentGroupWechat.count()
  .then(res => expectType<number>(res))

// qq
MyContentGroupQq.count()
  .then(res => expectType<number>(res))

// alipay
MyContentGroupAlipay.count()
  .then(res => expectType<number>(res))

// baidu
MyContentGroupBaidu.count()
  .then(res => expectType<number>(res))

// web
MyContentGroupWeb.count()
  .then(res => expectType<number>(res))



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



WechatBaaS.ContentGroup.get('123456')
QqBaaS.ContentGroup.get('123456')
AlipayBaaS.ContentGroup.get('123456')
BaiduBaaS.ContentGroup.get('123456')
WebBaaS.ContentGroup.get('123456')

/**
 * ContentGroup#get
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.ContentGroup.get('1234'))

// qq
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.ContentGroup.get('1234'))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(my.BaaS.ContentGroup.get('1234'))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(swan.BaaS.ContentGroup.get('1234'))

// web
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.ContentGroup.get('1234'))



WechatBaaS.ContentGroup.find()
QqBaaS.ContentGroup.find()
AlipayBaaS.ContentGroup.find()
BaiduBaaS.ContentGroup.find()
WebBaaS.ContentGroup.find()

/**
 * ContentGroup#find
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.ContentGroup.find())
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.ContentGroup.find({}))
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.ContentGroup.find({offset: 0, limit: 20, withCount: true}))

// qq
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.ContentGroup.find())
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.ContentGroup.find({}))
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.ContentGroup.find({offset: 0, limit: 20, withCount: true}))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(my.BaaS.ContentGroup.find())
expectType<Promise<AlipayBaaS.Response<any>>>(my.BaaS.ContentGroup.find({}))
expectType<Promise<AlipayBaaS.Response<any>>>(my.BaaS.ContentGroup.find({offset: 0, limit: 20, withCount: true}))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(swan.BaaS.ContentGroup.find())
expectType<Promise<BaiduBaaS.Response<any>>>(swan.BaaS.ContentGroup.find({}))
expectType<Promise<BaiduBaaS.Response<any>>>(swan.BaaS.ContentGroup.find({offset: 0, limit: 20, withCount: true}))

// web
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.ContentGroup.find())
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.ContentGroup.find({}))
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.ContentGroup.find({offset: 0, limit: 20, withCount: true}))