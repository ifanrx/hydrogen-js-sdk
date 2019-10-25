import {expectType} from 'tsd'

let GeoPolygonWechat = new wx.BaaS.GeoPolygon([[0, 0], [1, 1], [2, 2], [3, 3]])
let GeoPolygonQq = new qq.BaaS.GeoPolygon([[0, 0], [1, 1], [2, 2], [3, 3]])
let GeoPolygonAlipay = new my.BaaS.GeoPolygon([[0, 0], [1, 1], [2, 2], [3, 3]])
let GeoPolygonBaidu = new swan.BaaS.GeoPolygon([[0, 0], [1, 1], [2, 2], [3, 3]])
let GeoPolygonWeb = new window.BaaS.GeoPolygon([[0, 0], [1, 1], [2, 2], [3, 3]])

/**
 * GeoPoint#toGeoJSON
 */
// wechat
expectType<WechatBaaS.GeoJson>(GeoPolygonWechat.toGeoJSON())

// qq
expectType<QqBaaS.GeoJson>(GeoPolygonQq.toGeoJSON())

// alipay
expectType<AlipayBaaS.GeoJson>(GeoPolygonAlipay.toGeoJSON())

// baidu
expectType<BaiduBaaS.GeoJson>(GeoPolygonBaidu.toGeoJSON())

// web
expectType<WebBaaS.GeoJson>(GeoPolygonWeb.toGeoJSON())