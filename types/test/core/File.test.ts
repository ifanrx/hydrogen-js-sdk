import {expectType} from 'tsd'

let MyFileWechat = new wx.BaaS.File()
let MyFileQq = new qq.BaaS.File()
let MyFileAlipay = new my.BaaS.File()
let MyFileBaidu = new swan.BaaS.File()
let MyFileWeb = new window.BaaS.File()

/**
 * constructor
 */
// wechat
expectType<WechatBaaS.BaseQuery>(MyFileWechat as WechatBaaS.BaseQuery)

// qq
expectType<QqBaaS.BaseQuery>(MyFileQq as QqBaaS.BaseQuery)

// alipay
expectType<AlipayBaaS.BaseQuery>(MyFileAlipay as AlipayBaaS.BaseQuery)

// baidu
expectType<BaiduBaaS.BaseQuery>(MyFileBaidu as BaiduBaaS.BaseQuery)

// web
expectType<WebBaaS.BaseQuery>(MyFileWeb as WebBaaS.BaseQuery)


/**
 * File#upload
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyFileWechat.upload({filePath: 'path'}))
expectType<Promise<WechatBaaS.Response<any>>>(MyFileWechat.upload({filePath: 'path'}, {categoryID: '123'}))
expectType<Promise<WechatBaaS.Response<any>>>(MyFileWechat.upload({filePath: 'path'}, {categoryName: 'abc'}))

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyFileQq.upload({filePath: 'path'}))
expectType<Promise<QqBaaS.Response<any>>>(MyFileQq.upload({filePath: 'path'}, {categoryID: '123'}))
expectType<Promise<QqBaaS.Response<any>>>(MyFileQq.upload({filePath: 'path'}, {categoryName: 'abc'}))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileAlipay.upload({filePath: 'path'}))
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileAlipay.upload({filePath: 'path'}, {categoryID: '123'}))
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileAlipay.upload({filePath: 'path'}, {categoryName: 'abc'}))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileBaidu.upload({filePath: 'path'}))
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileBaidu.upload({filePath: 'path'}, {categoryID: '123'}))
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileBaidu.upload({filePath: 'path'}, {categoryName: 'abc'}))

// web
expectType<Promise<WebBaaS.Response<any>>>(MyFileWeb.upload({filePath: 'path'}))
expectType<Promise<WebBaaS.Response<any>>>(MyFileWeb.upload({filePath: 'path'}, {categoryID: '123'}))
expectType<Promise<WebBaaS.Response<any>>>(MyFileWeb.upload({filePath: 'path'}, {categoryName: 'abc'}))


/**
 * File#delete
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyFileWechat.delete('123'))

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyFileQq.delete('123'))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileAlipay.delete('123'))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileBaidu.delete('123'))

// web
expectType<Promise<WebBaaS.Response<any>>>(MyFileWeb.delete('123'))


/**
 * File#get
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyFileWechat.get('123'))

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyFileQq.get('123'))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileAlipay.get('123'))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileBaidu.get('123'))

// web
expectType<Promise<WebBaaS.Response<any>>>(MyFileWeb.get('123'))


/**
 * File#find
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(MyFileWechat.find())
expectType<Promise<WechatBaaS.Response<any>>>(MyFileWechat.find({}))
expectType<Promise<WechatBaaS.Response<any>>>(MyFileWechat.find({withCount: true}))

// qq
expectType<Promise<QqBaaS.Response<any>>>(MyFileQq.find())
expectType<Promise<QqBaaS.Response<any>>>(MyFileQq.find({}))
expectType<Promise<QqBaaS.Response<any>>>(MyFileQq.find({withCount: true}))

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileAlipay.find())
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileAlipay.find({}))
expectType<Promise<AlipayBaaS.Response<any>>>(MyFileAlipay.find({withCount: true}))

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileBaidu.find())
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileBaidu.find({}))
expectType<Promise<BaiduBaaS.Response<any>>>(MyFileBaidu.find({withCount: true}))

// web
expectType<Promise<WebBaaS.Response<any>>>(MyFileWeb.find())
expectType<Promise<WebBaaS.Response<any>>>(MyFileWeb.find({}))
expectType<Promise<WebBaaS.Response<any>>>(MyFileWeb.find({withCount: true}))


/**
 * File#count
 */
// wechat
MyFileWechat.count()
  .then(res => expectType<number>(res))

// qq
MyFileQq.count()
  .then(res => expectType<number>(res))

// alipay
MyFileAlipay.count()
  .then(res => expectType<number>(res))

// baidu
MyFileBaidu.count()
  .then(res => expectType<number>(res))

// web
MyFileWeb.count()
  .then(res => expectType<number>(res))



/**
 * File#genVideoSnapshot
 */
// wechat
expectType<Promise<WechatBaaS.FileOperationResult>>(MyFileWechat.genVideoSnapshot({source: '', save_as: '', point: ''}))
expectType<Promise<WechatBaaS.FileOperationResult>>(MyFileWechat.genVideoSnapshot({source: '', save_as: '', point: '', category_id: '', random_file_link: false, size: '', format: ''}))

// qq
expectType<Promise<QqBaaS.FileOperationResult>>(MyFileQq.genVideoSnapshot({source: '', save_as: '', point: ''}))
expectType<Promise<QqBaaS.FileOperationResult>>(MyFileQq.genVideoSnapshot({source: '', save_as: '', point: '', category_id: '', random_file_link: false, size: '', format: ''}))

// alipay
expectType<Promise<AlipayBaaS.FileOperationResult>>(MyFileAlipay.genVideoSnapshot({source: '', save_as: '', point: ''}))
expectType<Promise<AlipayBaaS.FileOperationResult>>(MyFileAlipay.genVideoSnapshot({source: '', save_as: '', point: '', category_id: '', random_file_link: false, size: '', format: ''}))

// baidu
expectType<Promise<BaiduBaaS.FileOperationResult>>(MyFileBaidu.genVideoSnapshot({source: '', save_as: '', point: ''}))
expectType<Promise<BaiduBaaS.FileOperationResult>>(MyFileBaidu.genVideoSnapshot({source: '', save_as: '', point: '', category_id: '', random_file_link: false, size: '', format: ''}))

// web
expectType<Promise<WebBaaS.FileOperationResult>>(MyFileWeb.genVideoSnapshot({source: '', save_as: '', point: ''}))
expectType<Promise<WebBaaS.FileOperationResult>>(MyFileWeb.genVideoSnapshot({source: '', save_as: '', point: '', category_id: '', random_file_link: false, size: '', format: ''}))


/**
 * File#videoConcat
 */
// wechat
expectType<Promise<WechatBaaS.FileOperationResult>>(MyFileWechat.videoConcat({m3u8s: [''], save_as: ''}))
expectType<Promise<WechatBaaS.FileOperationResult>>(MyFileWechat.videoConcat({m3u8s: [''], save_as: '', category_id: '', random_file_link: true}))

// qq
expectType<Promise<QqBaaS.FileOperationResult>>(MyFileQq.videoConcat({m3u8s: [''], save_as: ''}))
expectType<Promise<QqBaaS.FileOperationResult>>(MyFileQq.videoConcat({m3u8s: [''], save_as: '', category_id: '', random_file_link: true}))

// alipay
expectType<Promise<AlipayBaaS.FileOperationResult>>(MyFileAlipay.videoConcat({m3u8s: [''], save_as: ''}))
expectType<Promise<AlipayBaaS.FileOperationResult>>(MyFileAlipay.videoConcat({m3u8s: [''], save_as: '', category_id: '', random_file_link: true}))

// baidu
expectType<Promise<BaiduBaaS.FileOperationResult>>(MyFileBaidu.videoConcat({m3u8s: [''], save_as: ''}))
expectType<Promise<BaiduBaaS.FileOperationResult>>(MyFileBaidu.videoConcat({m3u8s: [''], save_as: '', category_id: '', random_file_link: true}))

// web
expectType<Promise<WebBaaS.FileOperationResult>>(MyFileWeb.videoConcat({m3u8s: [''], save_as: ''}))
expectType<Promise<WebBaaS.FileOperationResult>>(MyFileWeb.videoConcat({m3u8s: [''], save_as: '', category_id: '', random_file_link: true}))


/**
 * File#videoClip
 */
// wechat
expectType<Promise<WechatBaaS.FileOperationResult>>(MyFileWechat.videoClip({m3u8s: '', save_as: ''}))
expectType<Promise<WechatBaaS.FileOperationResult>>(MyFileWechat.videoClip({m3u8s: '', save_as: '', category_id: '', random_file_link: false, include: [''], exclude: [''], index: false}))

// qq
expectType<Promise<QqBaaS.FileOperationResult>>(MyFileQq.videoClip({m3u8s: '', save_as: ''}))
expectType<Promise<QqBaaS.FileOperationResult>>(MyFileQq.videoClip({m3u8s: '', save_as: '', category_id: '', random_file_link: false, include: [''], exclude: [''], index: false}))

// alipay
expectType<Promise<AlipayBaaS.FileOperationResult>>(MyFileAlipay.videoClip({m3u8s: '', save_as: ''}))
expectType<Promise<AlipayBaaS.FileOperationResult>>(MyFileAlipay.videoClip({m3u8s: '', save_as: '', category_id: '', random_file_link: false, include: [''], exclude: [''], index: false}))

// baidu
expectType<Promise<BaiduBaaS.FileOperationResult>>(MyFileBaidu.videoClip({m3u8s: '', save_as: ''}))
expectType<Promise<BaiduBaaS.FileOperationResult>>(MyFileBaidu.videoClip({m3u8s: '', save_as: '', category_id: '', random_file_link: false, include: [''], exclude: [''], index: false}))

// web
expectType<Promise<WebBaaS.FileOperationResult>>(MyFileWeb.videoClip({m3u8s: '', save_as: ''}))
expectType<Promise<WebBaaS.FileOperationResult>>(MyFileWeb.videoClip({m3u8s: '', save_as: '', category_id: '', random_file_link: false, include: [''], exclude: [''], index: false}))


/**
 * File#videoMeta
 */
// wechat
expectType<Promise<WechatBaaS.VideoMetaResult>>(MyFileWechat.videoMeta({m3u8s: ''}))

// qq
expectType<Promise<QqBaaS.VideoMetaResult>>(MyFileQq.videoMeta({m3u8s: ''}))

// alipay
expectType<Promise<AlipayBaaS.VideoMetaResult>>(MyFileAlipay.videoMeta({m3u8s: ''}))

// baidu
expectType<Promise<BaiduBaaS.VideoMetaResult>>(MyFileBaidu.videoMeta({m3u8s: ''}))

// web
expectType<Promise<WebBaaS.VideoMetaResult>>(MyFileWeb.videoMeta({m3u8s: ''}))


/**
 * File#videoAudioMeta
 */
// wechat
expectType<Promise<WechatBaaS.VideoAudioMetaResult>>(MyFileWechat.videoAudioMeta({source: '123'}))

// qq
expectType<Promise<QqBaaS.VideoAudioMetaResult>>(MyFileQq.videoAudioMeta({source: '123'}))

// alipay
expectType<Promise<AlipayBaaS.VideoAudioMetaResult>>(MyFileAlipay.videoAudioMeta({source: '123'}))

// baidu
expectType<Promise<BaiduBaaS.VideoAudioMetaResult>>(MyFileBaidu.videoAudioMeta({source: '123'}))

// web
expectType<Promise<WebBaaS.VideoAudioMetaResult>>(MyFileWeb.videoAudioMeta({source: '123'}))
