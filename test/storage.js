const storage = require('../core/storage')

describe('storage', () => {
  let key = 'key'
  let value = 'vaule'

  it('#set()', () => {
    expect(storage.set).to.be.a('function')
    storage.set(key, value)
  })

  it('#get()', () => {
    expect(storage.get).to.be.a('function')
    expect(storage.get(key)).to.equal(value)
  })
})
