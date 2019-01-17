module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: 'eslint:recommended',
  rules: {
    indent: ['error', 2],
    "linebreak-style": ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    "no-var": ['error'],
  },
  globals: {
    wx: true,
    describe: true,
    it: true,
    my: true,
    expect: true,
    beforeEach: true,
    before: true,
    BaaS: true,
    sinon: true,
    rewire: true,
    __VERSION_WEB__: true,
  }
}