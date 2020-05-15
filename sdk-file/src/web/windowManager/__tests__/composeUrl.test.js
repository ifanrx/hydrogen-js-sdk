const composeUrl = require('../composeUrl')


describe('composeUrl', () => {
  // const windowMock = {
  //   location: {
  //     href: 'http://test.com/index.html',
  //   }
  // }
  test('should return correct url with "create_user" - 01', () => {
    const options = {
      authPageUrl: 'http://test.com/auth.html',
      provider: 'mock-provider',
      mode: 'mock-mode',
      createUser: false,
      syncUserProfile: 'false',
      handler: 'mock-handler',
    }
    const result = composeUrl(options)
    const url = new URL(result)
    expect(url.origin + url.pathname).toBe(options.authPageUrl)
    expect(url.searchParams.get('provider')).toBe(options.provider)
    expect(url.searchParams.get('referer')).toBe('http://localhost/')
    expect(url.searchParams.get('mode')).toBe(options.mode)
    expect(url.searchParams.get('create_user')).toBe(null)
    expect(url.searchParams.get('update_userprofile')).toBe(options.syncUserProfile)
    expect(url.searchParams.get('handler')).toBe(options.handler)
  })

  test('should return correct url with "create_user" - 02', () => {
    const options = {
      authPageUrl: 'http://test.com/auth.html',
      provider: 'mock-provider',
      mode: 'mock-mode',
      syncUserProfile: 'false',
      handler: 'mock-handler',
    }
    const result = composeUrl(options)
    const url = new URL(result)
    expect(url.origin + url.pathname).toBe(options.authPageUrl)
    expect(url.searchParams.get('provider')).toBe(options.provider)
    expect(url.searchParams.get('referer')).toBe('http://localhost/')
    expect(url.searchParams.get('mode')).toBe(options.mode)
    expect(url.searchParams.get('create_user')).toBe('true')
    expect(url.searchParams.get('update_userprofile')).toBe(options.syncUserProfile)
    expect(url.searchParams.get('handler')).toBe(options.handler)
  })

  it('should return correct url with "update_userprofile"', () => {
    const options = {
      authPageUrl: 'http://test.com/auth.html',
      provider: 'mock-provider',
      mode: 'mock-mode',
      createUser: true,
      syncUserProfile: false,
      handler: 'mock-handler',
    }
    const result = composeUrl(options)
    const url = new URL(result)
    expect(url.origin + url.pathname).toBe(options.authPageUrl)
    expect(url.searchParams.get('provider')).toBe(options.provider)
    expect(url.searchParams.get('referer')).toBe('http://localhost/')
    expect(url.searchParams.get('mode')).toBe(options.mode)
    expect(url.searchParams.get('create_user')).toBe('true')
    expect(url.searchParams.get('update_userprofile')).toBe(null)
    expect(url.searchParams.get('handler')).toBe(options.handler)
  })
})
