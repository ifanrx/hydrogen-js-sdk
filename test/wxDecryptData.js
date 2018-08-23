const rewire = require('rewire')

const wechatDecrypt = rewire('../core/wxDecryptData')
const validateParams = wechatDecrypt.__get__('validateParams')

describe('wechatDecrypt', () => {
  it('#validateParams true', () => {
    let params = ['', '', 'we-run-data']
    expect(validateParams(params)).to.be.fales
  })

  it('#validateParams false', () => {
    let params = ['', 'we-run-data']
    let params2 = ['', '', '']
    expect(validateParams(params)).to.be.fales
    expect(validateParams(params2)).to.be.fales
  })
})