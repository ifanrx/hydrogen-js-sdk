const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const constants = require('../../core/constants')
const utils = require('../../core/utils')
const rewire = require('rewire')
const paymentModule = rewire('../../sdk-file/src/web/payment')
chai.use(sinonChai)
let expect = chai.expect

const createPayWithWechatFn = paymentModule.__get__('createPayWithWechatFn')
const createPayWithAlipayFn = paymentModule.__get__('createPayWithAlipayFn')

describe('payment', () => {
  let BaaS

  beforeEach(() => {
    BaaS = {
      _baasRequest: sinon.stub().resolves('test-result'),
      _config: {
        API: {
          PAY: '/mock-url/',
        },
      },
    }
  })

  describe('#payWithWechat', () => {
    ;['weixin_tenpay_wap', 'weixin_tenpay_native'].forEach(type => {
      it(`should request with correct params - "${type}"`, () => {
        const payWithWechat = createPayWithWechatFn(BaaS)
        return payWithWechat({
          gatewayType: type,
          totalCost: 10.01,
          merchandiseDescription: 'foo',
        }).then(res => {
          expect(res).to.equal('test-result')
          expect(BaaS._baasRequest).to.have.been.calledWithMatch({
            url: '/mock-url/',
            method: 'POST',
            data: {
              gateway_type: type,
              total_cost: 10.01,
              merchandise_description: 'foo',
            }
          })
        })
      })
    })

    it(`should request with correct params (all params)`, () => {
      const payWithWechat = createPayWithWechatFn(BaaS)
      return payWithWechat({
        gatewayType: 'weixin_tenpay_wap',
        totalCost: 12.34,
        merchandiseDescription: 'foo.baz',
        merchandiseSchemaID: '1234',
        merchandiseRecordID: '5678',
        merchandiseSnapshot: 'bar',
      }).then(res => {
        expect(res).to.equal('test-result')
        expect(BaaS._baasRequest).to.have.been.calledWithMatch({
          url: '/mock-url/',
          method: 'POST',
          data: {
            gateway_type: 'weixin_tenpay_wap',
            total_cost: 12.34,
            merchandise_description: 'foo.baz',
            merchandise_schema_id: '1234',
            merchandise_record_id: '5678',
            merchandise_snapshot: 'bar',
          }
        })
      })
    })

    it ('should throw error', () => {
      const payWithWechat = createPayWithWechatFn(BaaS)
      const successSpy = sinon.spy()
      return payWithWechat({
        gateway_type: 'bar',
        total_cost: 12.34,
        merchandise_description: 'foo.baz',
      })
        .then(successSpy)
        .catch(err => {
          expect(err.code).to.equal(608)
        })
        .then(() => {
          expect(successSpy).have.not.been.called
        })
    })
  })

  describe('#payWithAlipay', () => {
    ['alipay_wap', 'alipay_page'].forEach(type => {
      it(`should request with correct params - "${type}"`, () => {
        const payWithAlipay = createPayWithAlipayFn(BaaS)
        return payWithAlipay({
          gatewayType: type,
          totalCost: 10.01,
          merchandiseDescription: 'foo',
        }).then(res => {
          expect(res).to.equal('test-result')
          expect(BaaS._baasRequest).to.have.been.calledWithMatch({
            url: '/mock-url/',
            method: 'POST',
            data: {
              gateway_type: type,
              total_cost: 10.01,
              merchandise_description: 'foo',
            }
          })
        })
      })
    })

    it(`should request with correct params (all params)`, () => {
      const payWithAlipay = createPayWithAlipayFn(BaaS)
      return payWithAlipay({
        gatewayType: 'alipay_wap',
        totalCost: 12.34,
        merchandiseDescription: 'foo.baz',
        merchandiseSchemaID: '1234',
        merchandiseRecordID: '5678',
        merchandiseSnapshot: 'bar',
      }).then(res => {
        expect(res).to.equal('test-result')
        expect(BaaS._baasRequest).to.have.been.calledWithMatch({
          url: '/mock-url/',
          method: 'POST',
          data: {
            gateway_type: 'alipay_wap',
            total_cost: 12.34,
            merchandise_description: 'foo.baz',
            merchandise_schema_id: '1234',
            merchandise_record_id: '5678',
            merchandise_snapshot: 'bar',
          }
        })
      })
    })

    it ('should throw error', () => {
      const payWithAlipay = createPayWithAlipayFn(BaaS)
      const successSpy = sinon.spy()
      return payWithAlipay({
        gateway_type: 'bar',
        total_cost: 12.34,
        merchandise_description: 'foo.baz',
      })
        .then(successSpy)
        .catch(err => {
          expect(err.code).to.equal(608)
        })
        .then(() => {
          expect(successSpy).have.not.been.called
        })
    })
  })
})
