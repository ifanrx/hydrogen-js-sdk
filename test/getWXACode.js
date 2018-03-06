const rewire = require('rewire')

const getWXACode = rewire('../src/getWXACode')
const makeRealParams = getWXACode.__get__('makeRealParams')

describe('getWXACode', () => {
  const line_color = {'r': '0', 'g': '0', 'b': '0'}

  it('#makeRealParams type no string', () => {
    expect(() => makeRealParams(12, {scene: ''})).to.throw()
  })

  it('#makeRealParams type no allowed', () => {
    expect(() => makeRealParams('xxx', {path: '', scene: ''})).to.throw()
  })

  it('#makeRealParams params no allowed when type = "wxacode"', () => {
    expect(() => makeRealParams('wxacode', {scene: ''})).to.throw()
  })

  it('#makeRealParams params no allowed when type = "wxacodeunlimit"', () => {
    expect(() => makeRealParams('wxacodeunlimit', {path: ''})).to.throw()
  })

  it('#makeRealParams params no allowed when type = "wxaqrcode"', () => {
    expect(() => makeRealParams('wxaqrcode', {scene: ''})).to.throw()
  })

  it('#makeRealParams params no allowed when type = "wxaqrcode"', () => {
    expect(() => makeRealParams('wxaqrcode', {scene: ''})).to.throw()
  })

  it('#makeRealParams type = "wxacode"', () => {
    const params = {
      path: 'path',
      width: 100,
      auto_color: false,
      line_color
    }

    const realParams = {
      code_type: 'miniapp_permanent',
      path: 'path',
      options: {
        width: 100,
        auto_color: false,
        line_color: line_color,
      }
    }

    expect(makeRealParams('wxacode', params)).to.deep.equal(realParams)
  })

  it('#makeRealParams type = "wxacodeunlimit"', () => {
    const params = {
      scene: 'scene',
      page: 'page',
      width: 100,
      auto_color: false,
      line_color
    }

    const realParams = {
      code_type: 'miniapp_temporary',
      scene: 'scene',
      page: 'page',
      options: {
        width: 100,
        auto_color: false,
        line_color,
      }
    }

    expect(makeRealParams('wxacodeunlimit', params)).to.deep.equal(realParams)
  })

  it('#makeRealParams type = "wxaqrcode"', () => {
    const params = {
      path: 'path',
      width: 100,
    }

    const realParams = {
      code_type: 'miniapp_qr',
      path: 'path',
      options: {
        width: 100,
      }
    }

    expect(makeRealParams('wxaqrcode', params)).to.deep.equal(realParams)
  })
})