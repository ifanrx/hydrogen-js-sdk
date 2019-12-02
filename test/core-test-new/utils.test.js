const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const getResendPayload = require('../../core/utils/getResendPayload')
const withRetry = require('../../core/utils/withRetry')
chai.use(sinonChai)
let expect = chai.expect

describe('getResendPayload', () => {
  let BaaS
  beforeEach(() => {
    BaaS = {
      _config: {
        API: {
          USER_DETAIL: '/foo/bar/:userID/baz/',
        },
      },
      storage: {
        get: sinon.stub(),
      }
    }
  })

  it('should replace userID', () => {
    let id = '1234567'
    let payload = {
      url: '/foo/bar/1234567/baz/',
      test: 'test',
    }
    BaaS.storage.get.returns('7654321')
    const result = getResendPayload(BaaS, payload, id)
    expect(result).to.be.deep.equal({
      url: '/foo/bar/7654321/baz/',
      test: 'test',
    })
  })

  it('should\'t replace userID - 1', () => {
    let id = '123'
    let payload = {
      url: '/foo/bar/1234567/baz/',
      test: 'test',
    }
    BaaS.storage.get.returns('7654321')
    const result = getResendPayload(BaaS, payload, id)
    expect(result).to.be.deep.equal({
      url: '/foo/bar/1234567/baz/',
      test: 'test',
    })
  })

  it('should\'t replace userID - 2', () => {
    let id = '123'
    let payload = {
      url: '/bar/foo/baz/1234567/',
      test: 'test',
    }
    BaaS.storage.get.returns('7654321')
    const result = getResendPayload(BaaS, payload, id)
    expect(result).to.be.deep.equal({
      url: '/bar/foo/baz/1234567/',
      test: 'test',
    })
  })
})

describe('withRetry', () => {
  it('should retry fn until out of limit', () => {
    // sync
    const fn = sinon.stub().throws(new Error('test-error-01'))
    expect(() => {
      withRetry(fn, {context: null, maxCount: 20})()
    }).to.throw('test-error-01')
    expect(fn.callCount).to.be.equal(20)
    expect(() => {
      withRetry(fn, {context: null, maxCount: 5})()
    }).to.throw('test-error-01')
    expect(fn.callCount).to.be.equal(25)
    expect(() => {
      withRetry(fn, {context: null, maxCount: 6})()
    }).to.throw('test-error-01')
    expect(fn.callCount).to.be.equal(31)

    // async
    const fnAsync = sinon.stub().rejects(new Error('test-error-02'))
    return withRetry(fnAsync, {context: null, maxCount: 11})().catch(err => {
      expect(err.message).to.be.equal('test-error-02')
      expect(fnAsync.callCount).to.be.equal(11)
    })
  })

  it('should retry fn until fn called successfully', () => {
    // sync
    const fn = sinon.stub()
      .onCall(0).throws()
      .onCall(1).throws()
      .returns('success-01')
    const result = withRetry(fn)()
    expect(result).to.equal('success-01')
    expect(fn.callCount).to.be.equal(3)

    // async
    const fnAsync = sinon.stub()
      .onCall(0).rejects()
      .onCall(1).rejects()
      .onCall(2).rejects()
      .onCall(3).rejects()
      .resolves('success-02')
    return withRetry(fnAsync)().then(result => {
      expect(result).to.equal('success-02')
      expect(fnAsync.callCount).to.be.equal(5)
    })
  })

  it('should call fn with correct arguments', () => {
    // sync
    const fn = sinon.stub()
      .onCall(0).throws()
      .onCall(1).throws()
      .returns()
    withRetry(fn)('a', 'b', 'c', 1, 2, 3)
    expect(fn.callCount).to.be.equal(3)
    expect(fn).always.calledWith('a', 'b', 'c', 1, 2, 3)

    // async
    const fnAsync = sinon.stub()
      .onCall(0).rejects()
      .onCall(1).rejects()
      .onCall(2).rejects()
      .onCall(3).rejects()
      .resolves()
    return withRetry(fnAsync)(1, 2, 3, 'a', 'b', 'c').then(() => {
      expect(fnAsync.callCount).to.be.equal(5)
      expect(fnAsync).always.calledWith(1, 2, 3, 'a', 'b', 'c')
    })
  })

  it('should call fn with correct context', () => {
    // sync
    let context_sync = {
      a: 10,
      fn: function () {
        this.a += 10
      }
    }
    withRetry(context_sync.fn, {context: context_sync})()
    withRetry(context_sync.fn)()
    expect(context_sync.a).to.be.equal(20)

    // async
    let context_async = {
      b: 20,
    }
    const fnAsync = function () {
      this.b += 10
      return Promise.resolve()
    }
    return withRetry(fnAsync, {context: context_async})().then(() => {
      expect(context_async.b).to.be.equal(30)
    })
  })

  it('should match specific error only', () => {
    // sync
    const fn_1 = sinon.stub()
      .onCall(0).throws(new Error('retry-01'))
      .onCall(1).throws(new Error('retry-02'))
      .throws()
    expect(() => {
      withRetry(fn_1, {matchMessage: 'retry-01'})()
    }).to.throw()
    expect(fn_1.callCount).to.be.equal(2)

    const fn_2 = sinon.stub()
      .onCall(0).throws(new Error('retry-01'))
      .onCall(1).throws(new Error('retry-02'))
      .throws()
    expect(() => {
      withRetry(fn_2, {matchMessage: /retry/})()
    }).to.throw()
    expect(fn_2.callCount).to.be.equal(3)

    // async
    const fnAsync_1 = sinon.stub()
      .onCall(0).rejects(new Error('retry-03'))
      .onCall(1).rejects(new Error('retry-04'))
      .onCall(2).rejects(new Error('retry-11'))
      .rejects()
    return withRetry(fnAsync_1, {matchMessage: /retry-0/})().catch(() => {
      expect(fnAsync_1.callCount).to.be.equal(3)
    })
  })
})
