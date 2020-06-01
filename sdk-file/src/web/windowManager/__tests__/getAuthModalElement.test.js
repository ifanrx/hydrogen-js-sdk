const getAuthModalElement = require('../getAuthModalElement')

const normalizeHTMLString = (strings) => {
  return strings[0].replace(/(<.*?>)|\s+/g, (m, $1) => $1 ? $1 : '')
}

describe('getAuthModalElement', () => {
  it('should init authModal', () => {
    const html = normalizeHTMLString`
      <div id="auth-iframe__container" style="display: none; position: fixed; left: 0px; top: 0px; width: 100vw; height: 100vh; background-color: rgb(255, 255, 255); z-index: 1000;">
        <iframe id="auth-iframe__iframe" style="width: 100vw; height: 100vh;"></iframe>
        <div id="auth-iframe__close-btn" style="position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; z-index: 100;"></div>
      </div>
    `
    getAuthModalElement()
    getAuthModalElement()
    expect(document.body.innerHTML).toBe(html)
    getAuthModalElement()
    expect(document.body.innerHTML).toBe(html)
  })

  it('should not create new authModal', () => {
    const html = normalizeHTMLString`
      <div id="auth-iframe__container" style="display: none; position: fixed; left: 0px; top: 0px; width: 100vw; height: 100vh; background-color: rgb(255, 255, 255); z-index: 1000;">
        <iframe id="auth-iframe__iframe" style="width: 100vw; height: 100vh;"></iframe>
        <div id="auth-iframe__close-btn" style="position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; z-index: 100;"></div>
      </div>
    `
    document.body.innerHTML = html
    getAuthModalElement()
    expect(document.body.innerHTML).toBe(html)
  })
})
