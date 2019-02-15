describe('auth', () => {
  it('#handleUserInfo param value is undefined', () => {
    expect(() => global.BaaS.auth.handleUserInfo()).to.throw()
  })

  it('#handleUserInfo param value invaliad', () => {
    expect(() => global.BaaS.auth.handleUserInfo({a: 'b'})).to.throw()
  })
})
