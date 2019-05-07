module.exports = {
  "extends": [
    "typescript"
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': [0]
  }
};
