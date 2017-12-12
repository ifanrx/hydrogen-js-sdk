
const baasRequest = require('../src/baasRequest')

describe('baasRequest', () => {
  it('#excludeParams()', () => {
    let result = baasRequest.excludeParams('/hserve/v1/table/:tableID/', {tableID: 1, data: 'data'})
    expect(result).to.deep.equal({data: 'data'})
  });

  it('replaceQueryParams', () => {
    const requestParams = {
      categoryID: 12,
      otherData: 100
    }
    let result = baasRequest.replaceQueryParams(requestParams)
    expect(result).to.deep.equal({'category_id': 12, otherData: 100})
  });
})