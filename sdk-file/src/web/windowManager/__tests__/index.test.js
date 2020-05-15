let windowManager

describe('windowManager', () => {
  [['PopupIframe', 'popup-iframe'], ['PopupWindow', 'popup-window'], ['RedirectWindow', 'redirect']].forEach(item => {
    it(`should return ${item[0]}`, () => {
      jest.isolateModules(() => {
        windowManager = require('../index')
        const modal = {
          type: item[0],
        }
        const WindowStub = require(`../${item[0]}`)
        jest.mock(`../${item[0]}`)
        WindowStub.mockReturnValue(modal)
        const options = {
          foo: 'bar',
          bar: 'baz',
        }
        const result = windowManager.create(item[1], options)
        expect(WindowStub).toHaveBeenCalledWith(options)
        expect(result).toEqual(modal)
      })
    })
  })
})
