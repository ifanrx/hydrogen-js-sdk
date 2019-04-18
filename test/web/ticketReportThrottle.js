const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const constants = require('../../core/constants')
const ticketReportThrottle = rewire('../../core/utils/ticketReportThrottle')
chai.use(sinonChai)
let expect = chai.expect

describe('ticketReportThrottle', () => {
  it('should invoke fn at first time', () => {
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    ticketReportThrottle.__set__({lastInvokeTime: null})
    const fnStub = sinon.stub().resolves()
    ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    expect(fnStub).to.have.been.calledOnce
  })

  it('should not invoke fn if interval is less then "MIN_INTERVAL_PRE_TIME"', () => {
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    ticketReportThrottle.__set__({lastInvokeTime: null})
    let now = Date.now()
    const nowStub = sinon.stub(Date, 'now')
      .onCall(0).returns(now)
      .onCall(1).returns(now)
      .onCall(2).returns(now + constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL_PRE_TIME)
    const fnStub = sinon.stub().resolves()
    ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    nowStub.restore()
    expect(fnStub).to.have.been.calledOnce
  })

  it('should invoke fn if interval is greater then "MIN_INTERVAL_PRE_TIME"', () => {
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    ticketReportThrottle.__set__({lastInvokeTime: null})
    let now = Date.now()
    const nowStub = sinon.stub(Date, 'now')
      .onCall(0).returns(now)
      .onCall(1).returns(now)
      .onCall(2).returns(now + constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL_PRE_TIME + 1)
    const fnStub = sinon.stub().resolves()
    ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    nowStub.restore()
    expect(fnStub).to.have.been.calledTwice
  })

  it('should invoke fn if invoke times is under limit', () => {
    ticketReportThrottle.__set__({lastInvokeTime: null})
    let time = Date.now() - 100000
    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE - 1,
      timestamp: time,
    })
    const fnStub = sinon.stub().resolves()
    ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    expect(fnStub).to.have.been.calledOnce
    expect(BaaS.storage.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .to.be.deep.equal({
        invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE,
        timestamp: time,
      })
  })

  it('should not invoke fn if invoke times is over limit', () => {
    ticketReportThrottle.__set__({lastInvokeTime: null})
    let invokeRecord = {
      invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE,
      timestamp: Date.now() - 100000,
    }

    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, invokeRecord)
    const fnStub = sinon.stub().resolves()
    ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    expect(fnStub).to.have.not.been.called
    expect(BaaS.storage.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .to.be.deep.equal(invokeRecord)
  })

  it('should invoke fn if ttl of "invokeRecord" is greater then "TIMES_LIMIT.CYCLE"', () => {
    ticketReportThrottle.__set__({lastInvokeTime: null})
    let time = Date.now()
    const nowStub = sinon.stub(Date, 'now').returns(time)
    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE,
      timestamp: time - constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.CYCLE - 1,
    })
    const fnStub = sinon.stub().resolves()
    ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    expect(fnStub).to.have.been.calledOnce
    expect(BaaS.storage.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .to.be.deep.equal({
        invokeTimes: 1,
        timestamp: time,
      })
    nowStub.restore()
  })

  it('should invoke fn with correct params', () => {
    ticketReportThrottle.__set__({lastInvokeTime: null})
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    const fnStub = sinon.stub().resolves()
    ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    expect(fnStub).to.have.been.calledWith('foo')
  })

  it('should return correct value', () => {
    ticketReportThrottle.__set__({lastInvokeTime: null})
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    const value = 'fack-value'
    const fnStub = sinon.stub().resolves(value)
    return ticketReportThrottle(fnStub)('foo', {enableThrottle: true}).then(res => {
      expect(res).to.be.equal(value)
    })
  })

  it('should not throw error', () => {
    ticketReportThrottle.__set__({lastInvokeTime: null})
    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invokeTimes: NaN,
      timestamp: 'bar',
    })
    const fnStub = sinon.stub().resolves()
    const time = Date.now() + 1000
    const nowStub = sinon.stub(Date, 'now')
      .onCall(1).returns(time)
    expect(() => {
      ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    }).to.not.throw()
    expect(fnStub).to.have.been.calledOnce
    expect(BaaS.storage.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .to.be.deep.equal({
        invokeTimes: 1,
        timestamp: time,
      })
    nowStub.restore()
  })

  it('should return Promise always', () => {
    ticketReportThrottle.__set__({lastInvokeTime: null})
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    const fnStub = sinon.stub().resolves()
    const res1 = ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    const res2 = ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    const typeofRes1 = Object.prototype.toString.call(res1)
    const typeofRes2 = Object.prototype.toString.call(res2)
    expect(typeofRes1).to.be.equal('[object Promise]')
    expect(typeofRes2).to.be.equal('[object Promise]')
    expect(fnStub).to.have.been.calledOnce
  })

  it('should rollback "invokeTimes" if invoke fn fail', () => {
    ticketReportThrottle.__set__({lastInvokeTime: null})
    let invokeRecord = {
      invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE - 1,
      timestamp: Date.now() - 100000,
    }
    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, invokeRecord)
    const error = new Error('test error')
    const fnStub = sinon.stub().rejects(error)
    const fnSpy = sinon.spy()
    ticketReportThrottle(fnStub)('foo', {enableThrottle: true}).then(fnSpy).catch(err => {
      expect(fnStub).to.have.been.calledOnce
      expect(fnSpy).to.have.not.been.called
      expect(err).to.be.deep.equal(error)
      expect(BaaS.storage.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
        .to.be.deep.equal(invokeRecord)
    })
  })

  it('should invoke fn every time if throttle is disabled', () => {
    const fnStub = sinon.stub().resolves()
    new Array(constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE).fill(0).forEach(() => {
      ticketReportThrottle(fnStub)('foo')
      ticketReportThrottle(fnStub)('foo', {enableThrottle: false})
    })
    expect(fnStub.callCount).to.be.equal(constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE * 2)
  })
})
