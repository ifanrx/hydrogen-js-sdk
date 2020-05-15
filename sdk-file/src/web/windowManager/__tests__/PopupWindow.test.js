describe('PopupWindow', () => {
  const onClose = jest.fn()
  const options = {
    authPageUrl: 'http://localhost:8000/',
    provider: 'test-wechat',
    windowFeatures: 'top=100,left=100',
    handler: 'login',
    onClose,
  }
  const originUrl = 'http://test.com/index.html'
  const authPageUrl = 'http://test.html?a=10&b=20'
  const newWindowMock = {
    location: {
      href: originUrl,
    },
    close: jest.fn(),
    closed: false,
  }
  window.open = jest.fn().mockReturnValue(newWindowMock)
  window.clearTimeout = jest.fn()
  const composeUrlStub = require('../composeUrl')
  jest.mock('../composeUrl')
  composeUrlStub.mockReturnValue(authPageUrl)
  const PopupWindow = require('../PopupWindow')
  const popupWindow = new PopupWindow(options)

  test('should invoke window.open', () => {
    popupWindow.open()
    expect(window.open.mock.calls[0][0]).toEqual(authPageUrl)
    expect(window.open.mock.calls[0][2]).toEqual(options.windowFeatures)
  })

  test('should invoke onClose callback', () => {
    newWindowMock.closed = true  // mock window.close()
    return new Promise(resolve => {
      setTimeout(resolve, 600)
    }).then(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('close', () => {
    const callOrder = []
    window.clearTimeout.mockImplementation(() => {
      callOrder.push('clearTimeout')
    })
    newWindowMock.close.mockImplementation(() => {
      callOrder.push('close')
    })
    popupWindow.timer = 100
    popupWindow.close()
    expect(callOrder).toEqual(['clearTimeout', 'close'])
  })
})
