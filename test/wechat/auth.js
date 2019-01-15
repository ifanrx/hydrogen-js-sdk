const auth = require('../../core/auth')

describe('auth', () => {
  it('#handleUserInfo param value is undefined', () => {
    expect(() => auth.handleUserInfo()).to.throw()
  })

  it('#handleUserInfo param value invaliad', () => {
    expect(() => auth.handleUserInfo({a: 'b'})).to.throw()
  })
})
