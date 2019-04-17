const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const makeParams = require('../../core/utils').makeReportTicketParam
const constants = require('../../core/constants')
const faker = require('faker')
chai.use(sinonChai)
let expect = chai.expect

describe('templateMessage', () => {
  let randomString
  before(() => {
    randomString = faker.lorem.words(1)
  })

  it('#makeParams error', () => {
    expect(() => makeParams()).to.throw()
  })

  it('#makeParams', () => {
    let result1 = makeParams(randomString)
    expect(result1).to.deep.equal({'submission_type': 'form_id', submission_value: randomString})
  })

  describe('#invoke', () => {
    let requestStub
    beforeEach(() => {
      requestStub = sinon.stub(BaaS, 'request').resolves({
        statusCode: 201,
        data: {},
      })
    })

    afterEach(() => {
      requestStub.restore()
    })

    it('should invoke once', () => {
      BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
        invoke_times: 1,
        timestamp: Date.now(),
      })
      return Promise.all([
        BaaS.wxReportTicket('foo'),
        BaaS.wxReportTicket('bar'),
      ]).then(() => {
        expect(requestStub).to.have.been.calledOnce
      })
    })

    it('should invoke once(times limit)', () => {
      let now = Date.now()
      BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
        invoke_times: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES - 1,
        timestamp: now,
      })
      const nowStub = sinon.stub(Date, 'now')
        .onCall(0).returns(now + constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL)
        .onCall(1).returns(now + 2 * constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL + 1)
      return Promise.all([
        BaaS.wxReportTicket('foo'),
        BaaS.wxReportTicket('bar'),
      ]).then(() => {
        expect(requestStub).to.have.been.calledOnce
        nowStub.restore()
      })
    })

    it('should invoke twice', () => {
      let now = Date.now()
      BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
        invoke_times: 1,
        timestamp: now,
      })
      const nowStub = sinon.stub(Date, 'now')
        .onCall(0).returns(now + 3 * constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL)
        .onCall(1).returns(now + 4 * constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL + 1)
      return Promise.all([
        BaaS.wxReportTicket('foo'),
        BaaS.wxReportTicket('bar'),
      ]).then(() => {
        expect(requestStub).to.have.been.calledTwice
        nowStub.restore()
      })
    })
  })
})
