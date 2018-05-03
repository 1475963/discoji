module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true
  },
  globals: {
  },
  extends: 'eslint:recommended',
  rules: {
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single',
	  { allowTemplateLiterals: true }
    ],
    semi: [
      'error',
      'always'
    ],
    'max-params': [
      'error',
      4
    ],
    'max-lines': [
      'error',
      {
        max: 250,
        skipBlankLines: true,
        skipComments: true
      }
    ],
    'max-len': [
      'error',
      100
    ],
    'max-statements': [
      'error',
      40
    ],
    'no-unused-vars': [
      'error',
      'all'
    ],
    'no-multi-spaces': [
      'off'
    ],
    strict: [
      'error',
      'global'
    ],
    'prefer-const': [
      'error'
    ],
    'no-compare-neg-zero': [
      'error'
    ],
    'no-empty': [
      'error'
    ],
    'no-console': 0,
    'valid-jsdoc': [
      'error',
      {
        'requireReturn': false
      }
    ],
    'dot-notation': [
      'error'
    ],
    'no-else-return': [
      'error'
    ]
  }
}
