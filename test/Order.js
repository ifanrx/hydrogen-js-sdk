const Order = require('../core/order')

describe('Order', () => {
  it('#getOrderList', () => {
    let inst = new Order()
    let stub = global.sinon.stub(global.BaaS, 'getOrderList')
    stub.callsFake(params => {
      expect(params).to.deep.equal({
        merchandise_record_id: '1',
        merchandise_schema_id: '2',
        status: '3',
        trade_no: '4',
        transaction_no: '5',
        offset: 20,
        limit: 10,
        where: '{}',
      })

      stub.restore()
    })
    inst.offset(20).limit(10).getOrderList({
      merchandise_record_id: '1',
      merchandise_schema_id: '2',
      status: '3',
      trade_no: '4',
      transaction_no: '5'
    })

  })
})