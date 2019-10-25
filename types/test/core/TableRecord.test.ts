import {expectType} from 'tsd'

let tableRecord_wx = new wx.BaaS.TableRecord('123', '456')
let tableRecord_qq = new qq.BaaS.TableRecord('123', '456')
let tableRecord_my = new my.BaaS.TableRecord('123', '456')
let tableRecord_swan = new swan.BaaS.TableRecord('123', '456')
let tableRecord_window = new window.BaaS.TableRecord('123', '456')


/**
 * TableRecord#update
 */
// wechat
tableRecord_wx.update()
tableRecord_wx.update({})
tableRecord_wx.update({enableTrigger: true})
tableRecord_wx.update({withCount: true})
tableRecord_wx.update({withCount: true, enableTrigger: true})

// qq
tableRecord_qq.update()
tableRecord_qq.update({})
tableRecord_qq.update({enableTrigger: true})
tableRecord_qq.update({withCount: true})
tableRecord_qq.update({withCount: true, enableTrigger: true})

// alipay
tableRecord_my.update()
tableRecord_my.update({})
tableRecord_my.update({enableTrigger: true})
tableRecord_my.update({withCount: true})
tableRecord_my.update({withCount: true, enableTrigger: true})

// baidu
tableRecord_swan.update()
tableRecord_swan.update({})
tableRecord_swan.update({enableTrigger: true})
tableRecord_swan.update({withCount: true})
tableRecord_swan.update({withCount: true, enableTrigger: true})

// web
tableRecord_window.update()
tableRecord_window.update({})
tableRecord_window.update({enableTrigger: true})
tableRecord_window.update({withCount: true})
tableRecord_window.update({withCount: true, enableTrigger: true})


/**
 * TableRecord#save
 */
// wechat
expectType<Promise<WechatBaaS.Response<any>>>(tableRecord_wx.save())

// qq
expectType<Promise<QqBaaS.Response<any>>>(tableRecord_qq.save())

// alipay
expectType<Promise<AlipayBaaS.Response<any>>>(tableRecord_my.save())

// baidu
expectType<Promise<BaiduBaaS.Response<any>>>(tableRecord_swan.save())

// web
expectType<Promise<WebBaaS.Response<any>>>(tableRecord_window.save())

expectType<WechatBaaS.BaseRecord>(tableRecord_wx as WechatBaaS.BaseRecord)
expectType<QqBaaS.BaseRecord>(tableRecord_qq as QqBaaS.BaseRecord)
expectType<AlipayBaaS.BaseRecord>(tableRecord_my as AlipayBaaS.BaseRecord)
expectType<BaiduBaaS.BaseRecord>(tableRecord_swan as BaiduBaaS.BaseRecord)
expectType<WebBaaS.BaseRecord>(tableRecord_window as WebBaaS.BaseRecord)
