const AsyncStorage = require('@react-native-community/async-storage').default
const HError = require('core-module/HError')

class SyncStorage {
  constructor() {
    this.data = new Map()
  }

  init() {
    return AsyncStorage.getAllKeys().then((keys) =>
      AsyncStorage.multiGet(keys).then((data) => {
        data.forEach(this.saveItem.bind(this))
        return [...this.data]
      })
    )
  }

  get(key) {
    return this.data.get(key)
  }

  set(key, value) {
    if (!key) throw new HError(605)

    this.data.set(key, value)
    return AsyncStorage.setItem(key, JSON.stringify(value))
  }

  remove(key) {
    if (!key) throw new HError(605)

    this.data.delete(key)
    return AsyncStorage.removeItem(key)
  }

  saveItem(item) {
    let value
    try {
      value = JSON.parse(item[1])
    } catch (e) {
      [, value] = item
    }
    this.data.set(item[0], value)
  }

  getAllKeys() {
    return Array.from(this.data.keys())
  }
}

const syncStorage = new SyncStorage()

module.exports = syncStorage
