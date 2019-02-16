const utils = require('../../core/utils')

describe('utils', () => {
  it('#log', () => {
    expect(utils.log).to.be.a('function')
  })

  it('#format', () => {
    let url = '/hserve/v1/table/:tableID/'
    let params = {
      tableID: 10
    }
    expect(utils.format(url, params)).to.equal('/hserve/v1/table/10/')

    url = '/hserve/v1/table/:tableID/record/:recordID/'
    params = {
      tableID: 10,
      recordID: 20
    }
    expect(utils.format(url, params)).to.equal('/hserve/v1/table/10/record/20/')

    params = {
      tableID: 10,
      recordID: 20,
      ex: 30
    }

    expect(utils.format(url, params)).to.equal('/hserve/v1/table/10/record/20/')
  })

  it('#parseRegExp', () => {
    let regExpString = '^[a-zA-Z]+[0-9]*\\W?_$'
    let result = utils.parseRegExp(new RegExp(regExpString, 'gi'))

    expect(result).to.deep.equal([regExpString, 'gi'])
  })

  it('replaceQueryParams', () => {
    const requestParams = {
      categoryID: 12,
      otherData: 100
    }
    let result = utils.replaceQueryParams(requestParams)
    expect(result).to.deep.equal({'category_id': 12, otherData: 100})
  })

  it('checkVersion', () => {
    let versions = [
      ['v1.15.1', 'v1.15.2', -1],
      ['1.15', 'v1.15.2', -1],
      ['v1.15.1', '1.15.2', -1],
      ['2.9.2', 'v1.16.1', 1],
      ['1.16.1-a', 'v1.16.1-b', 0],
      ['v1.15.1a', '1.15.1', 0],
      ['v1.15', '1.15.0', 0],
    ]

    for (let i = 0; i < versions.length; i++) {
      expect(utils.checkVersion(versions[i][0], versions[i][1])).to.equal(versions[i][2])
    }
  })
})
