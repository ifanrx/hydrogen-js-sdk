import {expectType} from 'tsd'

/**
 * auth.loginWithWechat
 */
wx.BaaS.auth.loginWithWechat()
wx.BaaS.auth.loginWithWechat(null)
wx.BaaS.auth.loginWithWechat(null, {})
wx.BaaS.auth.loginWithWechat(null, {syncUserProfile: 'overwrite'})
wx.BaaS.auth.loginWithWechat(null, {syncUserProfile: 'setnx'})
wx.BaaS.auth.loginWithWechat(null, {syncUserProfile: 'false'})
wx.BaaS.auth.loginWithWechat(null, {syncUserProfile: 'false', createUser: true})
wx.BaaS.auth.loginWithWechat({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}})
wx.BaaS.auth.loginWithWechat({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}}, {})
wx.BaaS.auth.loginWithWechat({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}}, {syncUserProfile: 'false'})
wx.BaaS.auth.loginWithWechat({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}}, {syncUserProfile: 'false', createUser: true})
wx.BaaS.auth.loginWithWechat().then(user => expectType<WechatBaaS.CurrentUser>(user))


/**
 * wxCensorImage
 */
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.wxCensorImage('filepath'))

/**
 * wxCensorText
 */
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.wxCensorText('text'))

/**
 * censorAsync
 */
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.censorAsync('fileid'))

/**
 * getCensorResult
 */
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.getCensorResult(1))


/**
 * getWXACode
 */
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.getWXACode('type', {}))
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.getWXACode('type', {}, true))
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.getWXACode('type', {}, true, 'category'))

/**
 * pay
 */
expectType<Promise<any>>(wx.BaaS.pay({totalCost: 1, merchandiseDescription: 'test'}))
expectType<Promise<any>>(wx.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseRecordID: '1'}))
expectType<Promise<any>>(wx.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseSchemaID: '1'}))
expectType<Promise<any>>(wx.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseSnapshot: { test: 'a' }}))
expectType<Promise<any>>(wx.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', profitSharing: true}))
expectType<Promise<any>>(wx.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', profitSharing: false, merchandiseRecordID: '1', merchandiseSchemaID: '1', merchandiseSnapshot: { test: 'a' }}))

/**
 * reportTemplateMsgAnalytics
 */
wx.BaaS.reportTemplateMsgAnalytics({test: 'test'})

/**
 * request
 */
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.request({url: 'test'}))
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.request({url: 'test', method: 'POST'}))
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.request({url: 'test', method: 'POST', data: {a: 19}}))
expectType<Promise<WechatBaaS.Response<any>>>(wx.BaaS.request({url: 'test', method: 'POST', data: {a: 19}, header: {}}))


/**
 * wxDecryptData
 */
expectType<Promise<any>>(wx.BaaS.wxDecryptData('encryptedData', 'iv', 'type'))


/**
 * wxReportTicket
 */
expectType<Promise<any>>(wx.BaaS.wxReportTicket('formid'))
