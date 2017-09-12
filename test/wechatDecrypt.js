const wechatDecrypt = rewire('../src/wechatDecrypt')
const isValidParams = wechatDecrypt.__get__('isValidParams')

describe('wechatDecrypt', () => {
  it('#isValidParams true', () => {
    var params = ['', '', 'we-run-data']
    expect(isValidParams(params)).to.be.fales
  })

  it('#isValidParams false', () => {
    var params = ['', 'we-run-data']
    var params2 = ['', '', '']
    expect(isValidParams(params)).to.be.fales
    expect(isValidParams(params2)).to.be.fales
  })
})