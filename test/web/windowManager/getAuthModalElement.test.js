const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM
chai.use(sinonChai)
let expect = chai.expect

const normalizeHTMLString = (strings) => {
  return strings[0].replace(/(<.*?>)|\s+/g, (m, $1) => $1 ? $1 : '')
}

describe('should create new authModal', () => {
  it('should init authModal', () => {
    const initHtml = normalizeHTMLString`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body></body>
      </html>
    `
    const resultHtml = normalizeHTMLString`
      <div id="auth-iframe__container" style="display: none; position: fixed; left: 0px; top: 0px; width: 100vw; height: 100vh; background-color: rgb(255, 255, 255); z-index: 1000;">
        <iframe id="auth-iframe__iframe" style="width: 100vw; height: 100vh;"></iframe>
        <div id="auth-iframe__close-btn" style="position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; z-index: 100;"></div>
      </div>
    `
    const dom = new JSDOM(initHtml)
    var getAuthModalElement = rewire('../../../sdk-file/src/web/windowManager/getAuthModalElement')
    getAuthModalElement.__set__({
      window: dom.window,
      document: dom.window.document,
    })
    getAuthModalElement()
    getAuthModalElement()
    expect(dom.window.document.body.innerHTML).to.be.equal(resultHtml)
    getAuthModalElement()
    expect(dom.window.document.body.innerHTML).to.be.equal(resultHtml)
  })

  it('should not create new authModal', () => {
    const initHtml = normalizeHTMLString`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div id="auth-iframe__container" style="display: none; position: fixed; left: 0px; top: 0px; width: 100vw; height: 100vh; background-color: rgb(255, 255, 255); z-index: 1000;">
            <iframe id="auth-iframe__iframe" style="width: 100vw; height: 100vh;"></iframe>
            <div id="auth-iframe__close-btn" style="position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; z-index: 100;"></div>
          </div>
        </body>
      </html>
    `
    const resultHtml = normalizeHTMLString`
      <div id="auth-iframe__container" style="display: none; position: fixed; left: 0px; top: 0px; width: 100vw; height: 100vh; background-color: rgb(255, 255, 255); z-index: 1000;">
        <iframe id="auth-iframe__iframe" style="width: 100vw; height: 100vh;"></iframe>
        <div id="auth-iframe__close-btn" style="position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; z-index: 100;"></div>
      </div>
    `
    const dom = new JSDOM(initHtml)
    var getAuthModalElement = rewire('../../../sdk-file/src/web/windowManager/getAuthModalElement')
    getAuthModalElement.__set__({
      window: dom.window,
      document: dom.window.document,
    })
    getAuthModalElement()
    expect(dom.window.document.body.innerHTML).to.be.equal(resultHtml)
  })
})
