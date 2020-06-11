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
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  globals: {
    wx: true,
    describe: true,
    tt: true,
    it: true,
    my: true,
    qq: true,
    swan: true,
    jd: true,
    expect: true,
    beforeEach: true,
    before: true,
    BaaS: true,
    sinon: true,
    rewire: true,
    jest: true,
    test: true,
    __VERSION_WEB__: true,
    __VERSION_ALIPAY__: true,
    __VERSION_WECHAT__: true,
    __VERSION_QQ__: true,
    __VERSION_BAIDU__: true,
    __VERSION__: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
}
