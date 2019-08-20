import test from 'ava';
import sinon from 'sinon'

const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const decryptDataModule = require('../../sdk-file/src/qq/decryptData')
const HError = require('core-module/HError')

test.beforeEach(t => {
  t.context.BaaS = {
    _baasRequest: sinon.stub(),
    _config: {
      API: {
        QQ: {
          DECRYPT: 'decrypt-url/',
        },
      },
    },
  }
})

test('invoke encryptedData success', t => {
  decryptDataModule(t.context.BaaS)
  let encryptedData = 'encryptedData'
  let iv = 'iv'
  let type = 'open-gid'
  let data = {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz',
  }
  t.context.BaaS._baasRequest.resolves({
    status: 200,
    data,
  })
  return t.context.BaaS.decryptData(encryptedData, iv, type).then(res => {
    t.deepEqual(res, data)
    t.is(t.context.BaaS._baasRequest.callCount, 1)
    t.deepEqual(t.context.BaaS._baasRequest.getCall(0).args, [{
      data: {
        encryptedData: 'encryptedData',
        iv: 'iv',
      },
      method: 'POST',
      url: 'decrypt-url/open-gid/',
    }])
  })
})

test('invoke encryptedData fail (605)', t => {
  decryptDataModule(t.context.BaaS)
  let encryptedData = 'encryptedData'
  let iv = 'iv'
  let type = 'anyone'
  t.throws(() => {
    t.context.BaaS.decryptData(encryptedData, iv, type)
  }, new HError(605))
})

test('invoke encryptedData fail (403)', t => {
  decryptDataModule(t.context.BaaS)
  let encryptedData = 'encryptedData'
  let iv = 'iv'
  let type = 'open-gid'
  t.context.BaaS._baasRequest.rejects({code: 403})
  return t.context.BaaS.decryptData(encryptedData, iv, type).catch(err => {
    t.deepEqual(err, new HError(403, 'QQ 解密插件未开启'))
  })
})
