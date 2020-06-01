describe('RedirectWindow', () => {
  const authPageUrl = 'http://localhost:3000/auth.html?a=10&b=20'
  const options = {
    foo: 'bar',
    bar: 'baz',
  }
  const composeUrlStub = require('../composeUrl')
  jest.mock('../composeUrl')
  composeUrlStub.mockReturnValue(authPageUrl)
  const RedirectWindow = require('../RedirectWindow')
  const redirectWindow = new RedirectWindow(options)

  test('should invoke "composeUrl" and change url', () => {
    delete window.location
    window.location = {}
    redirectWindow.open()
    expect(composeUrlStub).toHaveBeenCalledTimes(1)
    expect(composeUrlStub).toHaveBeenCalledWith(options)
    expect(window.location.href).toBe(authPageUrl)
  })
})
