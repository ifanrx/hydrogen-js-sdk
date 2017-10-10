let config = require('../src/config')
const faker = require('faker')

const randomOption = config.RANDOM_OPTION

const generateRandomArray = (count) => {
  var len = 5, result = []
  if (count) {
    len = count
  }
  for (var i = 0; i < len; i++) {
    result.push(faker.random.number(randomOption))
  }
  return result
}

module.exports = {
  generateRandomArray
}