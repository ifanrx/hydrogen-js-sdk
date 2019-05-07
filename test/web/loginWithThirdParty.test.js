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

describe('loginWithThirdParty', () => {
  var auth = rewire('../../sdk-file/src/web/auth')
  let token = 'mock-token'
  let currentUserData = {
    id: 'mock-user-id',
  }
  const BaaS = {
    request: sinon.stub().resolves({
      status: 201,
      data: {}
    }),
    _polyfill: require('core-module/polyfill'),
    _config: require('core-module/config'),
    auth: {
      getCurrentUser: sinon.stub().resolves(currentUserData)
    },
    storage: {
      set: sinon.spy(),
    }
  }
  require('../../sdk-file/src/web/polyfill')(BaaS)
  auth.__set__({
    getThirdPartyAuthToken: sinon.stub().resolves(token),
    BaaS,
  })
  const loginWithThirdParty = auth.__get__('createLoginWithThirdPartyFn')(BaaS)

  it('should call "login" api', () => {
    const provider = 'test-weibo'
    return loginWithThirdParty(provider, 'http://localhost:3000/auth.html', {
      createUser: false,
      syncUserProfile: 'overwrite',
    }).then(res => {
      expect(res).to.be.deep.equal(currentUserData)
      expect(BaaS.request.getCall(0).args[0]).to.be.deep.equal({
        url: `/hserve/v2.0/idp/oauth/${provider}/login/`,
        method: 'POST',
        data: {
          token,
          create_user: false,
          update_userprofile: 'overwrite',
        }})
    })
  })
})
