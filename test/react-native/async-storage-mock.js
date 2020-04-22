let cache = {}

const multi = (arrKeys) => {
  const keys = Object.keys(cache)
  const arr = []
  for (let i = 0; i < keys.length; i++) {
    if (arrKeys.indexOf(keys[i]) !== -1) {
      arr.push(cache[keys[i]]) 
    }
  }
  return arr
}

module.exports = {
  multiGet: (keys) => {
    return new Promise((resolve, reject) => {
      return (typeof keys !== 'object')
        ? reject(new Error('keys must be array'))
        : resolve(multi(keys))
    })
  },
  setItem: (key, value) => {
    return new Promise((resolve, reject) => {
      return (typeof key !== 'string' || typeof value !== 'string')
        ? reject(new Error('key and value must be string'))
        : resolve(cache[key] = value)
    })
  },
  getItem: (key) => {
    return new Promise((resolve) => {
      return cache.hasOwnProperty(key)
        ? resolve(cache[key])
        : resolve(null)
    })
  },
  removeItem: (key) => {
    return new Promise((resolve, reject) => {
      return cache.hasOwnProperty(key)
        ? resolve(delete cache[key])
        : reject('No such key!')
    })
  },
  clear: () => {
    return new Promise((resolve) => resolve(cache = {}))
  },

  getAllKeys: () => {
    return new Promise((resolve) => resolve(Object.keys(cache)))
  },
}
