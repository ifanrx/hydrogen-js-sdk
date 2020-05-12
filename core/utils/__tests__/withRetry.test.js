const withRetry = require('../withRetry')

test('should retry fn until out of limit', () => {
  // sync
  const fn = jest.fn(() => {
    throw Error('test-error-01')
  })
  // const fn = sinon.stub().throws(new Error('test-error-01'))
  expect(() => {
    withRetry(fn, {context: null, maxCount: 20})()
  }).toThrowError('test-error-01')
  expect(fn.mock.calls.length).toEqual(20)
  expect(() => {
    withRetry(fn, {context: null, maxCount: 5})()
  }).toThrowError('test-error-01')
  expect(fn.mock.calls.length).toEqual(25)
  expect(() => {
    withRetry(fn, {context: null, maxCount: 6})()
  }).toThrowError('test-error-01')
  expect(fn.mock.calls.length).toEqual(31)

  // async
  const fnAsync = jest.fn().mockRejectedValue(new Error('test-error-02'))
  return withRetry(fnAsync, {context: null, maxCount: 11})().catch(err => {
    expect(err.message).toEqual('test-error-02')
    expect(fnAsync.mock.calls.length).toEqual(11)
  })
})

test('should retry fn until fn called successfully', () => {
  // sync
  const fn = jest.fn(() => 'success-01')
    .mockImplementationOnce(() => {
      throw Error()
    })
    .mockImplementationOnce(() => {
      throw Error()
    })
  const result = withRetry(fn)()
  expect(result).toEqual('success-01')
  expect(fn.mock.calls.length).toEqual(3)

  // async
  const fnAsync = jest.fn()
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockResolvedValue('success-02')
  return withRetry(fnAsync)().then(result => {
    expect(result).toEqual('success-02')
    expect(fnAsync.mock.calls.length).toEqual(5)
  })
})

test('should call fn with correct arguments', () => {
  // sync
  const fn = jest.fn()
    .mockImplementationOnce(() => {
      throw Error()
    })
    .mockImplementationOnce(() => {
      throw Error()
    })
  withRetry(fn)('a', 'b', 'c', 1, 2, 3)
  expect(fn.mock.calls).toEqual([
    ['a', 'b', 'c', 1, 2, 3],
    ['a', 'b', 'c', 1, 2, 3],
    ['a', 'b', 'c', 1, 2, 3],
  ])

  // async
  const fnAsync = jest.fn()
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockResolvedValue()
  return withRetry(fnAsync)(1, 2, 3, 'a', 'b', 'c').then(() => {
    expect(fnAsync.mock.calls).toEqual([
      [1, 2, 3, 'a', 'b', 'c'],
      [1, 2, 3, 'a', 'b', 'c'],
      [1, 2, 3, 'a', 'b', 'c'],
      [1, 2, 3, 'a', 'b', 'c'],
      [1, 2, 3, 'a', 'b', 'c'],
    ])
  })
})

test('should call fn with correct context', () => {
  // sync
  let context_sync = {
    a: 10,
    fn: function () {
      this.a += 10
    }
  }
  withRetry(context_sync.fn, {context: context_sync})()
  withRetry(context_sync.fn)()
  expect(context_sync.a).toEqual(20)

  // async
  let context_async = {
    b: 20,
  }
  const fnAsync = function () {
    this.b += 10
    return Promise.resolve()
  }
  return withRetry(fnAsync, {context: context_async})().then(() => {
    expect(context_async.b).toEqual(30)
  })
})

test('should match specific error only', () => {
  // sync
  const fn_1 = jest.fn(() => {
    throw Error()
  })
    .mockImplementationOnce(() => {
      throw Error('retry-01')
    })
    .mockImplementationOnce(() => {
      throw Error('retry-02')
    })
  expect(() => {
    withRetry(fn_1, {matchMessage: 'retry-01'})()
  }).toThrow()
  expect(fn_1.mock.calls.length).toEqual(2)

  const fn_2 = jest.fn(() => {
    throw Error()
  })
    .mockImplementationOnce(() => {
      throw Error('retry-01')
    })
    .mockImplementationOnce(() => {
      throw Error('retry-02')
    })
  expect(() => {
    withRetry(fn_2, {matchMessage: /retry/})()
  }).toThrow()
  expect(fn_2.mock.calls.length).toEqual(3)

  // async
  const fnAsync_1 = jest.fn()
    .mockRejectedValueOnce(new Error('retry-03'))
    .mockRejectedValueOnce(new Error('retry-04'))
    .mockRejectedValueOnce(new Error('retry-11'))
    .mockRejectedValue()
  return withRetry(fnAsync_1, {matchMessage: /retry-0/})().catch(() => {
    expect(fnAsync_1.mock.calls.length).toEqual(3)
  })
})
