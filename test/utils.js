const utils = require('../src/utils')

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
    let regExpString = '^[a-zA-Z]+[0-9]*\W?_$'
    let result = utils.parseRegExp(new RegExp(regExpString, 'gi'))

    expect(result).to.deep.equal([regExpString, 'gi'])
  })
})
