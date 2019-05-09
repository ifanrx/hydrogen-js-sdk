const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
chai.use(sinonChai)
let expect = chai.expect
require('./web-mock')

describe('linkThirdParty', () => {
  var auth = rewire('../../sdk-file/src/web/auth')
  const BaaS = {
    _polyfill: {},
  }
  let data = {
    status: 'success',
    handler: 'associate'
  }
  const thirdPartyAuthRequestStub = sinon.stub().resolves(data)
  let polyfill = rewire('../../sdk-file/src/web/polyfill')
  polyfill.__set__({
    thirdPartyAuthRequest: thirdPartyAuthRequestStub,
  })
  polyfill(BaaS)
  const linkThirdParty = BaaS._polyfill.linkThirdParty

  it('should call "thirdPartyAuthRequest"', () => {
    const provider = 'test-weibo'
    return linkThirdParty(provider, 'http://localhost:3000/auth.html', {
      syncUserProfile: 'overwrite',
    }).then(res => {
      expect(thirdPartyAuthRequestStub).to.have.been.calledWith({
        authPageUrl: 'http://localhost:3000/auth.html',
        handler: 'associate',
        provider,
        syncUserProfile: 'overwrite',
      })
      expect(res).to.be.deep.equal(data)
    })
  })
})
