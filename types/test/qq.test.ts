import {expectType} from 'tsd'

/**
 * auth.loginWithQQ
 */
qq.BaaS.auth.loginWithQQ()
qq.BaaS.auth.loginWithQQ(null)
qq.BaaS.auth.loginWithQQ(null, {})
qq.BaaS.auth.loginWithQQ(null, {syncUserProfile: 'overwrite'})
qq.BaaS.auth.loginWithQQ(null, {syncUserProfile: 'setnx'})
qq.BaaS.auth.loginWithQQ(null, {syncUserProfile: 'false'})
qq.BaaS.auth.loginWithQQ(null, {syncUserProfile: 'false', createUser: true})
qq.BaaS.auth.loginWithQQ({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}})
qq.BaaS.auth.loginWithQQ({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}}, {})
qq.BaaS.auth.loginWithQQ({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}}, {syncUserProfile: 'false'})
qq.BaaS.auth.loginWithQQ({detail: {userInfo: {}, encryptedData: '', iv: '', signature: '', rawData: ''}}, {syncUserProfile: 'false', createUser: true})
qq.BaaS.auth.loginWithQQ().then(user => expectType<QqBaaS.CurrentUser>(user))


/**
 * censorImage
 */
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.censorImage('filepath'))

/**
 * censorText
 */
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.censorText('text'))

/**
 * pay
 */
expectType<Promise<any>>(qq.BaaS.pay({totalCost: 1, merchandiseDescription: 'test'}))
expectType<Promise<any>>(qq.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseRecordID: '1'}))
expectType<Promise<any>>(qq.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseSchemaID: '1'}))
expectType<Promise<any>>(qq.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseSnapshot: { test: 'a' }}))
expectType<Promise<any>>(qq.BaaS.pay({totalCost: 1, merchandiseDescription: 'test'}))
expectType<Promise<any>>(qq.BaaS.pay({totalCost: 1, merchandiseDescription: 'test', merchandiseRecordID: '1', merchandiseSchemaID: '1', merchandiseSnapshot: { test: 'a' }}))

/**
 * reportTemplateMsgAnalytics
 */
qq.BaaS.reportTemplateMsgAnalytics({test: 'test'})

/**
 * request
 */
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.request({url: 'test'}))
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.request({url: 'test', method: 'POST'}))
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.request({url: 'test', method: 'POST', data: {a: 19}}))
expectType<Promise<QqBaaS.Response<any>>>(qq.BaaS.request({url: 'test', method: 'POST', data: {a: 19}, header: {}}))


/**
 * decryptData
 */
expectType<Promise<any>>(qq.BaaS.decryptData('encryptedData', 'iv', 'type'))


/**
 * reportTicket
 */
expectType<Promise<any>>(qq.BaaS.reportTicket('formid'))
