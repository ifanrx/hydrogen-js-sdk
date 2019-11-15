import {expectType} from 'tsd'

/**
 * auth.loginWithAlipay
 */
my.BaaS.auth.loginWithAlipay()
my.BaaS.auth.loginWithAlipay({forceLogin: true})
my.BaaS.auth.loginWithAlipay({scopes: ['test']})
my.BaaS.auth.loginWithAlipay({createUser: false})
my.BaaS.auth.loginWithAlipay({syncUserProfile: 'overwrite'})
my.BaaS.auth.loginWithAlipay({syncUserProfile: 'setnx'})
my.BaaS.auth.loginWithAlipay({syncUserProfile: 'false'})
my.BaaS.auth.loginWithAlipay({forceLogin: true, scopes: ['test'], createUser: false, syncUserProfile: 'overwrite'})
my.BaaS.auth.loginWithAlipay().then(user => expectType<AlipayBaaS.CurrentUser>(user))


/**
 * getAlipayQRCode
 */
expectType<Promise<AlipayBaaS.AlipayQRCodeResult>>(my.BaaS.getAlipayQRCode({urlParam: '', queryParam: '', describe: ''}))

/**
 * pay
 */
expectType<Promise<any>>(my.BaaS.pay({totalCost: 1, merchandiseDescription: 'test'}))
expectType<Promise<any>>(my.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseRecordID: '1'}))
expectType<Promise<any>>(my.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseSchemaID: '1'}))
expectType<Promise<any>>(my.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseSnapshot: { test: 'a' }}))
expectType<Promise<any>>(my.BaaS.pay({totalCost: 1, merchandiseDescription: 'test'}))
expectType<Promise<any>>(my.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseRecordID: '1', merchandiseSchemaID: '1', merchandiseSnapshot: { test: 'a' }}))

/**
 * reportTemplateMsgAnalytics
 */
my.BaaS.reportTemplateMsgAnalytics({test: 'test'})

/**
 * request
 */
expectType<Promise<AlipayBaaS.Response<any>>>(my.BaaS.request({url: 'test'}))
expectType<Promise<AlipayBaaS.Response<any>>>(my.BaaS.request({url: 'test', method: 'POST'}))
expectType<Promise<AlipayBaaS.Response<any>>>(my.BaaS.request({url: 'test', method: 'POST', data: {a: 19}}))
expectType<Promise<AlipayBaaS.Response<any>>>(my.BaaS.request({url: 'test', method: 'POST', data: {a: 19}, header: {}}))


/**
 * wxReportTicket
 */
expectType<Promise<any>>(my.BaaS.reportTicket('formid'))
