const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire')
const rewire = require('rewire')
const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM
const constants = require('core-module/constants')
const HError = require('core-module/HError')
const utils = require('../utils')
chai.use(sinonChai)
let expect = chai.expect

describe('thirdPartyAuthRequest', () => {
  const html = '<!DOCTYPE html><html><head></head><body></body></html>'
  const dom = new JSDOM(html, {
    url: 'http://test.org/',
    referrer: 'https://example.com/',
  })
  const token = 'mock-token'
  let openSpy, closeSpy, windowManager, addEventListenerSpy, removeEventListenerSpy

  beforeEach(() => {
    openSpy = sinon.spy()
    closeSpy = sinon.spy()
    windowManager = {
      create() {
        return {
          open: openSpy,
          close: closeSpy,
        }
      }
    }
    addEventListenerSpy = sinon.spy(dom.window, 'addEventListener')
    removeEventListenerSpy = sinon.spy(dom.window, 'removeEventListener')
  })

  afterEach(() => {
    addEventListenerSpy.restore()
    removeEventListenerSpy.restore()
  })

  it('should return data if recieve "success"', () => {
    const thirdPartyAuthRequest = rewire('../../sdk-file/src/web/thirdPartyAuthRequest')
    return utils.assertWithRewireMocks(thirdPartyAuthRequest, {
      window: dom.window,
      windowManager,
      test: true,
    })(() => {
      const data = {
        status: 'success',
        foo: 'bar',
        bar: 'baz',
      }
      dom.window.postMessage(data, 'http://test.org')
      return thirdPartyAuthRequest().then(result => {
        expect(result).to.be.deep.equal(data)
        expect(addEventListenerSpy).to.have.been.calledOnce
        expect(removeEventListenerSpy).to.have.been.calledOnce
        expect(addEventListenerSpy.getCall(0).args).to.be.deep.equal(removeEventListenerSpy.getCall(0).args)
        expect(openSpy).to.have.been.calledOnce
        return new Promise(resolve => {
          setTimeout(resolve, 1)
        }).then(() => {
          expect(closeSpy).to.have.been.calledOnce
        })
      })
    })
  })

  it('should throw error if recieve "fail"', () => {
    const thirdPartyAuthRequest = rewire('../../sdk-file/src/web/thirdPartyAuthRequest')
    return utils.assertWithRewireMocks(thirdPartyAuthRequest, {
      window: dom.window,
      windowManager,
      test: true,
    })(() => {
      const error = new Error('test error')
      dom.window.postMessage({status: 'fail', error}, '*')
      const job1 = thirdPartyAuthRequest().catch(err => {
        expect(err).to.be.deep.equal(new HError(613, error))
        expect(addEventListenerSpy).to.have.been.calledOnce
        expect(removeEventListenerSpy).to.have.been.calledOnce
        expect(addEventListenerSpy.getCall(0).args).to.be.deep.equal(removeEventListenerSpy.getCall(0).args)
      })
      const job2 = new Promise(resolve => {
        setTimeout(resolve, 1)
      }).then(() => {
        expect(closeSpy).to.have.been.calledOnce
      })
      expect(openSpy).to.have.been.calledOnce
      return Promise.all([job1, job2])
    })
  })
})
