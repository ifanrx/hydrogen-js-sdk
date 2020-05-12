module.exports = {
  get: jest.fn().mockImplementation(key => {
    if (key === 'uid') return Promise.resolve(10001)
    if (key === 'auth_token') return Promise.resolve('abc')
    if (key === 'session_expires_at') return Promise.resolve(Date.now() + 300000)
  })
}
