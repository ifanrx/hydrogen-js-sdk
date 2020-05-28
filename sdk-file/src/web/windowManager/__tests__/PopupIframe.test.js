describe('PopupIframe', () => {
  const onClose = jest.fn()
  const options = {
    authPageUrl: 'http://localhost:8000/',
    provider: 'test-wechat',
    windowFeatures: 'top=100,left=100',
    handler: 'login',
    onClose,
  }

  const authPageUrl = 'http://test.html/?a=10&b=20'
  const composeUrlStub = require('../composeUrl')
  jest.mock('../composeUrl')
  composeUrlStub.mockReturnValue(authPageUrl)

  const PopupIframe = require('../PopupIframe')
  const popupIframe = new PopupIframe(options)

  const {container, iframe, closeBtn} = require('../getAuthModalElement')()
  closeBtn.addEventListener = jest.fn()
  closeBtn.removeEventListener = jest.fn()

  let addEventListenerCalledArgs

  test('should show modal', () => {
    expect(container.style.display).toBe('none')
    popupIframe.open()
    expect(iframe.src).toBe(authPageUrl)
    expect(container.style.display).toBe('block')
    expect(closeBtn.addEventListener).toHaveBeenCalledTimes(1)
    addEventListenerCalledArgs = closeBtn.addEventListener.mock.calls[0]
  })

  test('should hide modal', () => {
    popupIframe.close()
    expect(iframe.src).toBe('http://localhost/')
    expect(container.style.display).toBe('none')
    expect(closeBtn.removeEventListener).toHaveBeenCalledTimes(1)
    expect(addEventListenerCalledArgs).toEqual(closeBtn.removeEventListener.mock.calls[0])
  })
})
