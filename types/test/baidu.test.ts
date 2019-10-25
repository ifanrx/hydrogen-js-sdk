import {expectType} from 'tsd'

/**
 * auth.loginWithThirdParty
 */
window.BaaS.auth.loginWithThirdParty('provider', 'authPageUrl')
window.BaaS.auth.loginWithThirdParty('provider', 'authPageUrl', {})
window.BaaS.auth.loginWithThirdParty('provider', 'authPageUrl', {syncUserProfile: false})
window.BaaS.auth.loginWithThirdParty('provider', 'authPageUrl', {syncUserProfile: false, createUser: true})
window.BaaS.auth.loginWithThirdParty('provider', 'authPageUrl', {syncUserProfile: false, createUser: true, debug: false})
window.BaaS.auth.loginWithThirdParty('provider', 'authPageUrl', {syncUserProfile: false, createUser: true, debug: false, mode: ''})
window.BaaS.auth.loginWithThirdParty('provider', 'authPageUrl', {syncUserProfile: false, createUser: true, debug: false, mode: '', authModalStyle: {}})
window.BaaS.auth.loginWithThirdParty('provider', 'authPageUrl', {syncUserProfile: false, createUser: true, debug: false, mode: '', authModalStyle: {}, wechatIframeContentStyle: {}})
window.BaaS.auth.loginWithThirdParty('provider', 'authPageUrl', {syncUserProfile: false, createUser: true, debug: false, mode: '', authModalStyle: {}, wechatIframeContentStyle: {}, windowFeatures: ''})
window.BaaS.auth.loginWithThirdParty('provider', 'authPageUrl', ).then(user => expectType<WebBaaS.CurrentUser>(user))

/**
 * auth.getRedirectResult
 */
expectType<Promise<WebBaaS.RedirectLoginResult>>(window.BaaS.auth.getRedirectResult())

/**
 * auth.thirdPartyAuth
 */
window.BaaS.auth.thirdPartyAuth()


/**
 * payment.payWithWechat
 */
expectType<Promise<any>>(window.BaaS.payment.payWithWechat({totalCost: 1, merchandiseDescription: 'test'}))
expectType<Promise<any>>(window.BaaS.payment.payWithWechat({totalCost: 1, merchandiseDescription: 'test', merchandiseRecordID: '1'}))
expectType<Promise<any>>(window.BaaS.payment.payWithWechat({totalCost: 1, merchandiseDescription: 'test', merchandiseSchemaID: '1'}))
expectType<Promise<any>>(window.BaaS.payment.payWithWechat({totalCost: 1, merchandiseDescription: 'test', merchandiseSnapshot: { test: 'a' }}))
expectType<Promise<any>>(window.BaaS.payment.payWithWechat({totalCost: 1, merchandiseDescription: 'test', profitSharing: true}))
expectType<Promise<any>>(window.BaaS.payment.payWithWechat({totalCost: 1, merchandiseDescription: 'test', profitSharing: true, merchandiseRecordID: '1', merchandiseSchemaID: '1', merchandiseSnapshot: { test: 'a' }}))

/**
 * payment.payWithAlipay
 */
expectType<Promise<any>>(window.BaaS.payment.payWithAlipay({totalCost: 1, merchandiseDescription: 'test'}))
expectType<Promise<any>>(window.BaaS.payment.payWithAlipay({totalCost: 1, merchandiseDescription: 'test', merchandiseRecordID: '1'}))
expectType<Promise<any>>(window.BaaS.payment.payWithAlipay({totalCost: 1, merchandiseDescription: 'test', merchandiseSchemaID: '1'}))
expectType<Promise<any>>(window.BaaS.payment.payWithAlipay({totalCost: 1, merchandiseDescription: 'test', merchandiseSnapshot: { test: 'a' }}))
expectType<Promise<any>>(window.BaaS.payment.payWithAlipay({totalCost: 1, merchandiseDescription: 'test', merchandiseRecordID: '1', merchandiseSchemaID: '1', merchandiseSnapshot: { test: 'a' }}))

/**
 * payment.payWithQQ
 */
expectType<Promise<any>>(window.BaaS.payment.payWithQQ({totalCost: 1, merchandiseDescription: 'test'}))
expectType<Promise<any>>(window.BaaS.payment.payWithQQ({totalCost: 1, merchandiseDescription: 'test', merchandiseRecordID: '1'}))
expectType<Promise<any>>(window.BaaS.payment.payWithQQ({totalCost: 1, merchandiseDescription: 'test', merchandiseSchemaID: '1'}))
expectType<Promise<any>>(window.BaaS.payment.payWithQQ({totalCost: 1, merchandiseDescription: 'test', merchandiseSnapshot: { test: 'a' }}))
expectType<Promise<any>>(window.BaaS.payment.payWithQQ({totalCost: 1, merchandiseDescription: 'test', merchandiseRecordID: '1', merchandiseSchemaID: '1', merchandiseSnapshot: { test: 'a' }}))


/**
 * request
 */
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.request({url: 'test'}))
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.request({url: 'test', method: 'POST'}))
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.request({url: 'test', method: 'POST', data: {a: 19}}))
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.request({url: 'test', method: 'POST', data: {a: 19}, header: {}}))
expectType<Promise<WebBaaS.Response<any>>>(window.BaaS.request({url: 'test', method: 'POST', data: {a: 19}, header: {}, headers: {}}))