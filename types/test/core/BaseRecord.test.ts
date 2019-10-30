import {expectType} from 'tsd'

// wechat
let record_1 = new wx.BaaS.BaseRecord()
expectType<WechatBaaS.BaseRecord>(
  record_1
    .append('key', 'value')
    .incrementBy('key', 1)
    .remove('key', 'value')
    .set('key', 'value')
    .set({a: 'a', b: 'b'})
    .patchObject('key', {a: 'a', b: 'b'})
    .uAppend('key', 'value')
    .uAppend('key', ['value1', 'value2'])
    .unset('key')
    .unset({'key1': null, 'key2': null}))

// qq
let record_2 = new qq.BaaS.BaseRecord()
expectType<QqBaaS.BaseRecord>(
  record_2
    .append('key', 'value')
    .incrementBy('key', 1)
    .remove('key', 'value')
    .set('key', 'value')
    .set({a: 'a', b: 'b'})
    .patchObject('key', {a: 'a', b: 'b'})
    .uAppend('key', 'value')
    .uAppend('key', ['value1', 'value2'])
    .unset('key')
    .unset({'key1': null, 'key2': null}))

// alipay
let record_3 = new my.BaaS.BaseRecord()
expectType<AlipayBaaS.BaseRecord>(
  record_3
    .append('key', 'value')
    .incrementBy('key', 1)
    .remove('key', 'value')
    .set('key', 'value')
    .set({a: 'a', b: 'b'})
    .patchObject('key', {a: 'a', b: 'b'})
    .uAppend('key', 'value')
    .uAppend('key', ['value1', 'value2'])
    .unset('key')
    .unset({'key1': null, 'key2': null}))

// baidu
let record_4 = new swan.BaaS.BaseRecord()
expectType<BaiduBaaS.BaseRecord>(
  record_4
    .append('key', 'value')
    .incrementBy('key', 1)
    .remove('key', 'value')
    .set('key', 'value')
    .set({a: 'a', b: 'b'})
    .patchObject('key', {a: 'a', b: 'b'})
    .uAppend('key', 'value')
    .uAppend('key', ['value1', 'value2'])
    .unset('key')
    .unset({'key1': null, 'key2': null}))

// web
let record_5 = new window.BaaS.BaseRecord()
expectType<WebBaaS.BaseRecord>(
  record_5
    .append('key', 'value')
    .incrementBy('key', 1)
    .remove('key', 'value')
    .set('key', 'value')
    .set({a: 'a', b: 'b'})
    .patchObject('key', {a: 'a', b: 'b'})
    .uAppend('key', 'value')
    .uAppend('key', ['value1', 'value2'])
    .unset('key')
    .unset({'key1': null, 'key2': null}))