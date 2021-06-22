const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const config = require('../../core/config')
chai.use(sinonChai)
let expect = chai.expect

describe('auth', () => {
  let requestStub
  let request

  beforeEach(() => {
    BaaS.clearSession()
    BaaS._config.updateUserprofile = ''
    request = BaaS.request
    requestStub = sinon.stub(BaaS, 'request').callsFake(options => {
      return request(options)
    })
  })

  afterEach(() => {
    requestStub.restore()
  })

  describe('# loginWithKs', () => {
    it('default to true without passing create_user', () => {
      const now = Date.now()
      const nowStub = sinon.stub(Date, 'now').returns(now)
      return BaaS.auth.loginWithKs({detail: {encryptedData: 'xxx', iv: 'xxx'}},{code: 'xxx'}).catch(() => {
        expect(requestStub.getCall(0).args[0]).to.be.deep.equal({
          url: config.API.KUAISHOU.PHONE_LOGIN,
          method: 'POST',
          data: {
            code: 'xxx',
            encryptedData: 'xxx',
            iv: 'xxx',
            create_user: true,
          },
        })
        nowStub.restore()
      })
    })

  })
  describe('# updatePhoneNumber', () => {
    it('default to true without passing overwrite', () => {
      const now = Date.now()
      const nowStub = sinon.stub(Date, 'now').returns(now)
      return BaaS.auth.updatePhoneNumber({detail: {encryptedData: 'xxx', iv: 'xxx'}}).catch(() => {
        expect(requestStub.getCall(0).args[0]).to.be.deep.equal({
          url: config.API.KUAISHOU.UPDATE_PHONE,
          method: 'PUT',
          data: {
            encryptedData: 'xxx',
            iv: 'xxx',
            overwrite: true,
          },
        })
        nowStub.restore()
      })
    })

  })
})
