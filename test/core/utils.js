const utils = require('../../core/utils')
const sinon = require('sinon')

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

  it('compareVersion', () => {
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
      expect(utils.compareVersion(versions[i][0], versions[i][1])).to.equal(versions[i][2])
    }
  })

  it('#doCreateRequestMethod()', () => {
    const bassRequestStub = sinon.stub(BaaS, '_baasRequest').resolves()
    const METHOD_MAP_LIST = {
      fakeFunction: {
        url: '/hserve/v2.0/table/:tableID/record/?limit=:limit&offset=:offset&where=:where&enable_trigger=:enable_trigger',
        method: 'PUT'
      },
    }
    utils.doCreateRequestMethod(METHOD_MAP_LIST)
    return BaaS.fakeFunction({
      tableID: 12345,
      where: JSON.stringify({"$and":[{"state":{"$contains":"一一"}}]}),
      limit: 10,
      offset: 5,
      enable_trigger: 1,
      data: {
        a: 10,
        b: 20,
      }
    }).then(() => {
      let spyCall = bassRequestStub.getCall(0)
      expect(spyCall.args[0]).to.deep.equal({
        url: '/hserve/v2.0/table/12345/record/?limit=10&offset=5&where=%7B%22%24and%22%3A%5B%7B%22state%22%3A%7B%22%24contains%22%3A%22%E4%B8%80%E4%B8%80%22%7D%7D%5D%7D&enable_trigger=1',
        method: 'PUT',
        data: {
          a: 10,
          b: 20,
        },
      })
      bassRequestStub.restore()
    })
  })
})
