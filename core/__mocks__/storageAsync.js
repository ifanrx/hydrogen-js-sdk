const faker = require('faker')

faker.seed(123)

const cache = {}

module.exports = {
  get: jest.fn().mockImplementation(key => {
    if (!cache[key]) {
      switch(key) {
      case 'uid':
        cache[key] = faker.random.number()
        break
      case 'auth_token':
        cache[key] = faker.random.uuid()
        break
      case 'session_expires_at':
        cache[key] = Date.now() + faker.random.number() * 1000 // 默认生成一个未过期的时间
        break
      }
    }
    return Promise.resolve(cache[key])
  }),
  set: function(key, value) {
    cache[key] = value
    return Promise.resolve()
  }
}
