const rewire = require('rewire')

const getWXACode = rewire('../src/getWXACode')
const makeRealParams = getWXACode.__get__('makeRealParams')

describe('getWXACode', () => {
  const line_color = {'r': '0', 'g': '0', 'b': '0'}

  it('#makeRealParams type is not string', () => {
    expect(() => makeRealParams(12, {scene: ''})).to.throw()
  })

  it('#makeRealParams params is not object', () => {
    expect(() => makeRealParams('wxacode', 123)).to.throw()
  })

  it('#makeRealParams type value is not allowed', () => {
    expect(() => makeRealParams('xxx', {path: '', scene: ''})).to.throw()
  })

  it('#makeRealParams params value is not allowed when type = "wxacode"', () => {
    expect(() => makeRealParams('wxacode', {scene: ''})).to.throw()
  })

  it('#makeRealParams params is not allowed when type = "wxacodeunlimit"', () => {
    expect(() => makeRealParams('wxacodeunlimit', {path: ''})).to.throw()
  })

  it('#makeRealParams params is not allowed when type = "wxaqrcode"', () => {
    expect(() => makeRealParams('wxaqrcode', {scene: ''})).to.throw()
  })

  it('#makeRealParams params is not allowed when type = "wxaqrcode"', () => {
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

  it('#makeRealParams type = "wxacode" and add invalid values ', () => {
    const params = {
      path: 'path',
      width: 100,
      auto_color: false,
      line_color,
      height: 100,
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
      path: 'page',
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

  it('#set cdn', () => {
    const params = {
      path: 'path',
      width: 100,
    }

    const realParams = {
      code_type: 'miniapp_qr',
      upload_to_cdn: true,
      path: 'path',
      options: {
        width: 100,
      }
    }

    expect(makeRealParams('wxaqrcode', params, true)).to.deep.equal(realParams)
  })

  it('#set cdn and categoryName', () => {
    const params = {
      path: 'path',
      width: 100,
    }

    const realParams = {
      code_type: 'miniapp_qr',
      upload_to_cdn: true,
      category_name: 'folder',
      path: 'path',
      options: {
        width: 100,
      }
    }

    expect(makeRealParams('wxaqrcode', params, true, 'folder')).to.deep.equal(realParams)
  })

  it('#set categoryName without cdn', () => {
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

    expect(makeRealParams('wxaqrcode', params, false, 'folder')).to.deep.equal(realParams)
  })
})