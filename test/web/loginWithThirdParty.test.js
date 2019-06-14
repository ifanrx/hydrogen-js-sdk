const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
chai.use(sinonChai)
let expect = chai.expect
require('./web-mock')

describe('loginWithThirdParty', () => {
  var auth = rewire('../../sdk-file/src/web/auth')
  let currentUserData = {
    id: 'mock-user-id',
  }
  const BaaS = {
    auth: {
      getCurrentUser: sinon.stub().resolves(currentUserData)
    },
  }
  const thirdPartyAuthRequestStub = sinon.stub().resolves({
    status: 'success',
    handler: 'login'
  })
  auth.__set__({
    thirdPartyAuthRequest: thirdPartyAuthRequestStub,
    BaaS,
  })
  const loginWithThirdParty = auth.__get__('createLoginWithThirdPartyFn')(BaaS)

  it('should call "login" api', () => {
    const provider = 'test-weibo'
    return loginWithThirdParty(provider, 'http://localhost:3000/auth.html', {
      createUser: false,
      syncUserProfile: 'overwrite',
    }).then(res => {
      expect(thirdPartyAuthRequestStub).to.have.been.calledWith({
        authPageUrl: 'http://localhost:3000/auth.html',
        createUser: false,
        handler: 'login',
        provider,
        syncUserProfile: 'overwrite',
      })
      expect(res).to.be.deep.equal(currentUserData)
      expect(BaaS.auth.getCurrentUser).to.have.been.calledOnce
    })
  })
})
