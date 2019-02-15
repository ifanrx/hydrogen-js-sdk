let config = require('../../core/config')
const faker = require('faker')

const randomOption = config.RANDOM_OPTION

const generateRandomArray = (count) => {
  let len = 5, result = []
  if (count) {
    len = count
  }
  for (let i = 0; i < len; i++) {
    result.push(faker.random.number(randomOption))
  }
  return result
}

module.exports = {
  generateRandomArray
}
