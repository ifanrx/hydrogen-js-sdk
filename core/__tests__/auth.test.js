const BaaS = require('../baas')
jest.mock('../baas')
jest.mock('../storageAsync')
jest.mock('../User')

const auth = require('../auth')

auth.getCurrentUser = jest.fn()
BaaS._polyfill = {
  ...BaaS._polyfill,
  handleLoginSuccess: jest.fn(),
}
BaaS.request = jest.fn().mockResolvedValue({
  status: 200,
})

describe('auth', () => {
  ['login', 'register'].forEach(action => {
    test(`should request ${action} api with mobilePhone`, () => {
      return auth[action]({username: 'xxx', phone: 'abc', password: 'password'}).then(() => {
        expect(BaaS.request.mock.calls[0][0].data).toEqual({
          phone: 'abc',
          password: 'password',
        })
        expect(BaaS.request.mock.calls[0][0].url).toMatch(new RegExp(`^/hserve/v[\\d.]+/${action}/phone/?$`))
      })
    })

    test(`should request ${action} api with email`, () => {
      return auth[action]({username: 'xxx', email: 'abc', password: 'password'}).then(() => {
        expect(BaaS.request.mock.calls[0][0].data).toEqual({
          email: 'abc',
          password: 'password',
        })
        expect(BaaS.request.mock.calls[0][0].url).toMatch(new RegExp(`^/hserve/v[\\d.]+/${action}/email/?$`))
      })
    })

    test(`should request ${action} api with mobilePhone`, () => {
      return auth[action]({username: 'xxx', phone: '12345', email: 'abc', password: 'password'}).then(() => {
        expect(BaaS.request.mock.calls[0][0].data).toEqual({
          phone: '12345',
          password: 'password',
        })
        expect(BaaS.request.mock.calls[0][0].url).toMatch(new RegExp(`^/hserve/v[\\d.]+/${action}/phone/?$`))
      })
    })

    test(`should request ${action} api with username as default`, () => {
      return auth[action]({password: 'password'}).then(() => {
        expect(BaaS.request.mock.calls[0][0].data).toEqual({
          username: '',
          password: 'password',
        })
        expect(BaaS.request.mock.calls[0][0].url).toMatch(new RegExp(`^/hserve/v[\\d.]+/${action}/username/?$`))
      })
    })
  })
})
