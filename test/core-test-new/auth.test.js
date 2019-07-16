const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const HError = require('core-module/HError')
const utils = require('../utils')
chai.use(sinonChai)
let expect = chai.expect
global.URL = require('url').URL
global.URLSearchParams = require('url').URLSearchParams

const createBaaSMockObj = ({requestStub, getCurrentUserStub} = {}) => ({
  request: requestStub,
  _polyfill: {
    handleLoginSuccess: sinon.spy(),
  },
  _config: {
    API: {
      WEB: {
        THIRD_PARTY_LOGIN: '/foo/:provider/bar/baz/login/',
        THIRD_PARTY_ASSOCIATE: '/foo/:provider/bar/baz/associate/',
        THIRD_PARTY_AUTH: '/foo/:provider/bar/baz/redirect/',
      },
    },
  },
  auth: {
    getCurrentUser: getCurrentUserStub,
  }
})

describe('auth', () => {
  ;['login', 'register'].forEach(action => {
    describe(`# ${action}`, () => {
      let authModule = rewire('core-module/auth.js')
      const actionFunc = authModule.__get__(action)
      const BaaS = authModule.__get__('BaaS')
      authModule.__set__('getCurrentUser', () => {})
      BaaS._polyfill.handleLoginSuccess = () => {}

      beforeEach(() => {
        BaaS.request = sinon.stub().resolves({
          status: 200,
        })
      })

      it(`should request ${action} api with mobilePhone`, () => {
        return actionFunc({username: 'xxx', phone: 'abc', password: 'password'}).then(() => {
          expect(BaaS.request.getCall(0).args[0].data).to.be.deep.equal({
            phone: 'abc',
            password: 'password',
          })
          expect(BaaS.request.getCall(0).args[0].url).to.be.equal(`/hserve/v2.1/${action}/phone/`)
        })
      })

      it(`should request ${action} api with email`, () => {
        return actionFunc({username: 'xxx', email: 'abc', password: 'password'}).then(() => {
          expect(BaaS.request.getCall(0).args[0].data).to.be.deep.equal({
            email: 'abc',
            password: 'password',
          })
          expect(BaaS.request.getCall(0).args[0].url).to.be.equal(`/hserve/v2.1/${action}/email/`)
        })
      })

      it(`should request ${action} api with mobilePhone`, () => {
        return actionFunc({username: 'xxx', phone: '12345', email: 'abc', password: 'password'}).then(() => {
          expect(BaaS.request.getCall(0).args[0].data).to.be.deep.equal({
            phone: '12345',
            password: 'password',
          })
          expect(BaaS.request.getCall(0).args[0].url).to.be.equal(`/hserve/v2.1/${action}/phone/`)
        })
      })

      it(`should request ${action} api with username as default`, () => {
        return actionFunc({password: 'password'}).then(() => {
          expect(BaaS.request.getCall(0).args[0].data).to.be.deep.equal({
            username: '',
            password: 'password',
          })
          expect(BaaS.request.getCall(0).args[0].url).to.be.equal(`/hserve/v2.1/${action}/username/`)
        })
      })
    })
  })
})
