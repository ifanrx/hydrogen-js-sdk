import test from 'ava'
import sinon from 'sinon'

const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const payModule = require('../../sdk-file/src/baidu/pay')

test('swan.pay', t => {
  let BaaS = {
    _baasRequest: sinon.stub().resolves({
      data: {
        data: 'test-data',
        tpOrderId: 'foo', // 最终的 transaction_no
      },
    }),
    _config: {
      API: {
        PAY: 'payment-url',
      },
    },
  }
  global.swan = {
    requestPolymerPayment: sinon.stub().callsFake(({success}) => {
      success({test: 'test-result'})
    })
  }
  payModule(BaaS)
  let params = {
    merchandiseSchemaID: 'merchandise_schema_id', // optional
    merchandiseRecordID: 'merchandise_record_id', // optional
    merchandiseSnapshot: 'merchandise_snapshot', // optional
    merchandiseDescription: 'merchandise_description', // required
    totalCost: 'total_cost', // required
  }
  return BaaS.pay(params).then(res => {
    t.deepEqual(res, {
      test: 'test-result',
      transaction_no: 'foo',
    })
    t.is(global.swan.requestPolymerPayment.callCount, 1)
    t.is(BaaS._baasRequest.callCount, 1)
    t.is(global.swan.requestPolymerPayment.getCall(0).args[0].orderInfo.data, 'test-data')
    t.deepEqual(BaaS._baasRequest.getCall(0).args, [{
      data: {
        gateway_type: 'baidu_miniapp_pay',
        merchandise_schema_id: 'merchandise_schema_id',
        merchandise_record_id: 'merchandise_record_id',
        merchandise_snapshot: 'merchandise_snapshot',
        merchandise_description: 'merchandise_description',
        total_cost: 'total_cost',
      },
      method: 'POST',
      url: 'payment-url',
    }])
  })
});
