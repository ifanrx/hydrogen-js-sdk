
const baasRequest = require('../core/baasRequest')

describe('baasRequest', () => {
  it('#excludeParams()', () => {
    let result = baasRequest.excludeParams('/hserve/v1/table/:tableID/', {tableID: 1, data: 'data'})
    expect(result).to.deep.equal({data: 'data'})
  })
})