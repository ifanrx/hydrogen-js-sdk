import {expectType} from 'tsd'

// wechat
let tableRecord_1 = new wx.BaaS.TableRecord('123', '456')
tableRecord_1.save()
  .then(res => expectType<WechatBaaS.Response<any>>(res))
tableRecord_1.update()
tableRecord_1.update({enableTrigger: true})
  .then(res => expectType<WechatBaaS.Response<any>>(res))
expectType<WechatBaaS.BaseRecord>(tableRecord_1 as WechatBaaS.BaseRecord)