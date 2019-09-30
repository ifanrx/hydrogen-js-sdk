const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
chai.use(sinonChai)
let expect = chai.expect
global.URL = require('url').URL
const composeUrl = rewire('../../../sdk-file/src/web/windowManager/composeUrl')

describe('composeUrl', () => {
  const windowMock = {
    location: {
      href: 'http://test.com/index.html',
    }
  }
  let options, result, url
  it('should return correct url with "create_user" - 01', () => {
    return new Promise(resolve => {
      composeUrl.__with__('window', windowMock)(() => {
        options = {
          authPageUrl: 'http://test.com/auth.html',
          provider: 'mock-provider',
          mode: 'mock-mode',
          createUser: false,
          syncUserProfile: 'false',
          handler: 'mock-handler',
        }
        result = composeUrl(options)
        url = new URL(result)
        expect(url.origin + url.pathname).to.be.equal(options.authPageUrl)
        expect(url.searchParams.get('provider')).to.be.equal(options.provider)
        expect(url.searchParams.get('referer')).to.be.equal(windowMock.location.href)
        expect(url.searchParams.get('mode')).to.be.equal(options.mode)
        expect(url.searchParams.get('create_user')).to.be.equal(null)
        expect(url.searchParams.get('update_userprofile')).to.be.equal(options.syncUserProfile)
        expect(url.searchParams.get('handler')).to.be.equal(options.handler)
        resolve()
      })
    })
  })

  it('should return correct url with "create_user" - 02', () => {
    return new Promise(resolve => {
      composeUrl.__with__('window', windowMock)(() => {
        options = {
          authPageUrl: 'http://test.com/auth.html',
          provider: 'mock-provider',
          mode: 'mock-mode',
          syncUserProfile: 'false',
          handler: 'mock-handler',
        }
        result = composeUrl(options)
        url = new URL(result)
        expect(url.origin + url.pathname).to.be.equal(options.authPageUrl)
        expect(url.searchParams.get('provider')).to.be.equal(options.provider)
        expect(url.searchParams.get('referer')).to.be.equal(windowMock.location.href)
        expect(url.searchParams.get('mode')).to.be.equal(options.mode)
        expect(url.searchParams.get('create_user')).to.be.equal('true')
        expect(url.searchParams.get('update_userprofile')).to.be.equal(options.syncUserProfile)
        expect(url.searchParams.get('handler')).to.be.equal(options.handler)
        resolve()
      })
    })
  })

  it('should return correct url with "update_userprofile"', () => {
    return new Promise(resolve => {
      composeUrl.__with__('window', windowMock)(() => {
        options = {
          authPageUrl: 'http://test.com/auth.html',
          provider: 'mock-provider',
          mode: 'mock-mode',
          createUser: true,
          syncUserProfile: false,
          handler: 'mock-handler',
        }
        result = composeUrl(options)
        url = new URL(result)
        expect(url.origin + url.pathname).to.be.equal(options.authPageUrl)
        expect(url.searchParams.get('provider')).to.be.equal(options.provider)
        expect(url.searchParams.get('referer')).to.be.equal(windowMock.location.href)
        expect(url.searchParams.get('mode')).to.be.equal(options.mode)
        expect(url.searchParams.get('create_user')).to.be.equal('true')
        expect(url.searchParams.get('update_userprofile')).to.be.equal(null)
        expect(url.searchParams.get('handler')).to.be.equal(options.handler)
        resolve()
      })
    })
  })
})
