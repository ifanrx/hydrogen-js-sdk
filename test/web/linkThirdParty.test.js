const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM
chai.use(sinonChai)
let expect = chai.expect
require('./web-mock')

describe('linkThirdParty', () => {
  var auth = rewire('../../sdk-file/src/web/auth')
  let token = 'mock-token'
  const BaaS = {
    request: sinon.stub().resolves({
      status: 201,
      data: {}
    }),
    _polyfill: require('core-module/polyfill'),
    _config: require('core-module/config'),
    auth: {
      getCurrentUser: sinon.stub().resolves('user-data')
    },
    storage: {
      set: sinon.spy(),
    }
  }
  const polyfill = rewire('../../sdk-file/src/web/polyfill')
  polyfill(BaaS)
  polyfill.__set__({
    getThirdPartyAuthToken: sinon.stub().resolves(token),
  })
  const linkThirdParty = BaaS._polyfill.linkThirdParty

  it('should call "associate" api', () => {
    const provider = 'test-wechat'
    return linkThirdParty(provider, 'http://localhost:3000/auth.html', {
      syncUserProfile: 'overwrite',
    }).then(() => {
      expect(BaaS.request.getCall(0).args[0]).to.be.deep.equal({
        url: `/hserve/v2.0/oauth/${provider}/associate/`,
        method: 'POST',
        data: {
          token,
          update_userprofile: 'overwrite',
        }})
    })
  })
})
