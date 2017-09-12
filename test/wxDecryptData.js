const wechatDecrypt = rewire('../src/wxDecryptData')
const validateParams = wechatDecrypt.__get__('validateParams')

describe('wechatDecrypt', () => {
  it('#validateParams true', () => {
    var params = ['', '', 'we-run-data']
    expect(validateParams(params)).to.be.fales
  })

  it('#validateParams false', () => {
    var params = ['', 'we-run-data']
    var params2 = ['', '', '']
    expect(validateParams(params)).to.be.fales
    expect(validateParams(params2)).to.be.fales
  })
})