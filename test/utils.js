const assertWithRewireMocks = (module, mocks) => func => {
  return new Promise((resolve, reject) => {
    module.__with__(mocks)(() => {
      try {
        const result = func()
        if (Object.prototype.toString.call(result) == '[object Promise]') {
          return result.then(resolve).catch(reject)
        }
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  })
}

const normalizeHTMLString = (strings) => {
  return strings[0].replace(/(<.*?>)|\s+/g, (m, $1) => $1 ? $1 : '')
}

module.exports = {
  assertWithRewireMocks,
  normalizeHTMLString,
}
