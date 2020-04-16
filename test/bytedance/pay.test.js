import test from 'ava'
import sinon from 'sinon'
const rewire = require('rewire')


global.tt = {
  getSystemInfoSync() {
    return {
      appName: 'toutiao',
    }
  },
}
const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const payModule = rewire('../../sdk-file/src/bytedance/pay')

test('createGetOrderStatusFn - success', t => {
  const createGetOrderStatusFn = payModule.__get__('createGetOrderStatusFn')
  const getOrder = sinon.stub().resolves({
    data: {
      status: 'success'
    }
  })
  let BaaS = {
    Order: () => ({
      get: getOrder,
    }),
  }
  const transaction_no = 'abc123'
  const resolve = sinon.spy()
  const getOrderStatus = createGetOrderStatusFn(BaaS, transaction_no, {resolve, reject: () => {}})
  return getOrderStatus().then(res => {
    t.deepEqual(res, {code: 0})
    t.is(getOrder.callCount, 1)
    t.is(resolve.callCount, 1)
    t.deepEqual(resolve.getCall(0).args, [{transaction_no}])
  })
})

test('createGetOrderStatusFn - failed', t => {
  const createGetOrderStatusFn = payModule.__get__('createGetOrderStatusFn')
  const getOrder = sinon.stub().resolves({
    data: {
      status: 'failed'
    }
  })
  let BaaS = {
    Order: () => ({
      get: getOrder,
    }),
  }
  const data = {
    a: 1,
    b: 2,
  }
  const reject = sinon.spy()
  const getOrderStatus = createGetOrderStatusFn(BaaS, data, {resolve: () => {}, reject})
  return getOrderStatus().then(res => {
    t.deepEqual(res, {code: 2})
    t.is(getOrder.callCount, 1)
    t.is(reject.callCount, 1)
    t.is(reject.getCall(0).args[0].code, 608)
  })
})


test('createGetOrderStatusFn - pending', t => {
  const createGetOrderStatusFn = payModule.__get__('createGetOrderStatusFn')
  const getOrder = sinon.stub()
    .onCall(0).resolves({
      data: {
        status: 'pending'
      }
    })
    .onCall(1).resolves({
      data: {
        status: 'pending'
      }
    })
    .onCall(2).resolves({
      data: {
        status: 'success'
      }
    })
  let BaaS = {
    Order: () => ({
      get: getOrder,
    }),
  }
  const data = {
    a: 1,
    b: 2,
  }
  const getOrderStatus = createGetOrderStatusFn(BaaS, data, {resolve: () => {}, reject: () => {}})
  return getOrderStatus().then(res => {
    t.deepEqual(res, {code: 0})
    t.is(getOrder.callCount, 3)
  })
})


test('createGetOrderStatusFn - retry exceeded limit', t => {
  const createGetOrderStatusFn = payModule.__get__('createGetOrderStatusFn')
  const getOrder = sinon.stub().resolves({
    data: {
      status: 'pending'
    }
  })
  let BaaS = {
    Order: () => ({
      get: getOrder,
    }),
  }
  const data = {
    a: 1,
    b: 2,
  }
  const getOrderStatus = createGetOrderStatusFn(BaaS, data, {resolve: () => {}, reject: () => {}})
  return getOrderStatus().then(res => {
    t.deepEqual(res, {code: 2})
    t.is(getOrder.callCount, 5)
  })
})


test('createGetOrderStatusFn - unkown', t => {
  const createGetOrderStatusFn = payModule.__get__('createGetOrderStatusFn')
  const getOrder = sinon.stub().resolves({
    data: {
      status: 'others'
    }
  })
  let BaaS = {
    Order: () => ({
      get: getOrder,
    }),
  }
  const data = {
    a: 1,
    b: 2,
  }
  const getOrderStatus = createGetOrderStatusFn(BaaS, data, {resolve: () => {}, reject: () => {}})
  return getOrderStatus().then(res => {
    t.deepEqual(res, {code: 9})
  })
})
