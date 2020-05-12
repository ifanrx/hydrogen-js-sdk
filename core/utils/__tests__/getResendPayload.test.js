const getResendPayload = require('../getResendPayload')

const BaaS = {
  _config: {
    API: {
      USER_DETAIL: '/foo/bar/:userID/baz/',
    },
  },
  storageAsync: {
    get: jest.fn(),
  }
}


test('should replace userID.', () => {
  let id = '1234567'
  let payload = {
    url: '/foo/bar/1234567/baz/',
    test: 'test',
  }
  BaaS.storageAsync.get.mockResolvedValue('7654321')
  return getResendPayload(BaaS, payload, id).then(result => {
    expect(result).toEqual({
      url: '/foo/bar/7654321/baz/',
      test: 'test',
    })
  })
})

test('should\'t replace userID - 1', () => {
  let id = '123'
  let payload = {
    url: '/foo/bar/1234567/baz/',
    test: 'test',
  }
  BaaS.storageAsync.get.mockResolvedValue('7654321')
  return getResendPayload(BaaS, payload, id).then(result => {
    expect(result).toEqual({
      url: '/foo/bar/1234567/baz/',
      test: 'test',
    })
  })
})

test('should\'t replace userID - 2', () => {
  let id = '1234567'
  let payload = {
    url: '/bar/foo/baz/1234567/',
    test: 'test',
  }
  BaaS.storageAsync.get.mockResolvedValue('7654321')
  return getResendPayload(BaaS, payload, id).then(result => {
    expect(result).toEqual({
      url: '/bar/foo/baz/1234567/',
      test: 'test',
    })
  })
})
