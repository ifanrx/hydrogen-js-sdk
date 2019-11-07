const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const getResendPayload = require('../../core/utils/getResendPayload')
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
