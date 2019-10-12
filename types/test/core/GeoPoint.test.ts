import {expectType} from 'tsd'

let GeoPointWechat = new wx.BaaS.GeoPoint(10, 10)
let GeoPointQq = new qq.BaaS.GeoPoint(10, 10)
let GeoPointAlipay = new my.BaaS.GeoPoint(10, 10)
let GeoPointBaidu = new swan.BaaS.GeoPoint(10, 10)
let GeoPointWeb = new window.BaaS.GeoPoint(10, 10)

/**
 * GeoPoint#toGeoJSON
 */
// wechat
expectType<WechatBaaS.GeoJson>(GeoPointWechat.toGeoJSON())

// qq
expectType<QqBaaS.GeoJson>(GeoPointQq.toGeoJSON())

// alipay
expectType<AlipayBaaS.GeoJson>(GeoPointAlipay.toGeoJSON())

// baidu
expectType<BaiduBaaS.GeoJson>(GeoPointBaidu.toGeoJSON())

// web
expectType<WebBaaS.GeoJson>(GeoPointWeb.toGeoJSON())