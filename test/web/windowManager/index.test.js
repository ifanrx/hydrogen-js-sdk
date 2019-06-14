const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire')
const rewire = require('rewire')
const constants = require('core-module/constants')
chai.use(sinonChai)
let expect = chai.expect

describe('windowManager', () => {
  [['PopupIframe', 'popup-iframe'], ['PopupWindow', 'popup-window'], ['RedirectWindow', 'redirect']].forEach(item => {
    it(`should return ${item[0]}`, () => {
      const modal = {
        type: item[0],
      }
      const WindowStub = sinon.stub().returns(modal)
      const windowManager = proxyquire('../../../sdk-file/src/web/windowManager', {
        [`./${item[0]}`]: WindowStub,
      })
      const options = {
        foo: 'bar',
        bar: 'baz',
      }
      const result = windowManager.create(item[1], options)
      expect(WindowStub).to.have.been.calledWithNew
      expect(WindowStub).to.have.been.calledWith(options)
      expect(result).to.be.deep.equal(modal)
    })
  })
})
