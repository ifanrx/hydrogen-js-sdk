const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const constants = require('../../core/constants')
const utils = require('../../core/utils')
chai.use(sinonChai)

describe('baasRequest', () => {
  it('#excludeParams()', () => {
    let result = utils.excludeParams('/hserve/v1/table/:tableID/', {tableID: 1, data: 'data'})
    expect(result).to.deep.equal({data: 'data'})
  })

  it('#wx.request', () => {
    let token = 'mock-token-request'
    let data = {
      foo: 'bar',
    }
    let dataType = 'json-test'
    let fail, success
    BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, token)
    let wxRequestStub
    if (!wx.request) {
      wxRequestStub = wx.request = sinon.stub()
    } else {
      wxRequestStub = sinon.stub(wx, 'request')
    }
    wxRequestStub.callsFake(function (options) {
      success = options.success
      fail = options.fail
      options.success({
        statusCode: 200,
        data: {},
      })
    })
    return BaaS._baasRequest({
      url: '/any-url/',
      method: 'POST',
      data,
      dataType,
    }).then(() => {
      expect(wxRequestStub.getCall(0).args[0]).to.deep.equal({
        method: 'POST',
        url: 'https://' +  BaaS.test.clientID + '.myminapp.com/any-url/',
        data,
        header: {
          'X-Hydrogen-Client-ID': BaaS.test.clientID,
          'X-Hydrogen-Client-Version': global.__VERSION_WECHAT__,
          'X-Hydrogen-Client-Platform': BaaS._polyfill.CLIENT_PLATFORM,
          'X-Hydrogen-Client-SDK-Type': 'file',
          'Authorization': 'Hydrogen-r1 ' + token,
        },
        dataType,
        success,
        fail,
      })
      wxRequestStub.restore && wxRequestStub.restore()
    })
  })
})
