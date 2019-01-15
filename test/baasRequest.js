const baasRequest = require('../core/baasRequest')
const utils = require('../core/utils')

describe('baasRequest', () => {
  it('#excludeParams()', () => {
    let result = utils.excludeParams('/hserve/v1/table/:tableID/', {tableID: 1, data: 'data'})
    expect(result).to.deep.equal({data: 'data'})
  })
})
