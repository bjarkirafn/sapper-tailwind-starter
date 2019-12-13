module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },

  env: {
    es6: true,
    browser: true,
    node: true
  },
  plugins: [ 'svelte3', 'prettier' ],
  overrides: [
    {
      files: [ '**/*.svelte' ],
      processor: 'svelte3/svelte3'
    }
  ],
  rules: {
    'max-len': [
      'error',
      {
        code: 100,
        ignoreUrls: true,
        ignoreComments: true
      }
    ],
    'indent': 'off',
    'keyword-spacing': [ 2, { before: true, after: true } ],
    'space-before-blocks': [ 2, 'always' ],
    'no-mixed-spaces-and-tabs': [ 2, 'smart-tabs' ],
    'no-cond-assign': 0,
    'object-shorthand': [ 2, 'always' ],
    'no-const-assign': 2,
    'no-class-assign': 2,
    'no-this-before-super': 2,
    'no-var': 2,
    'no-unreachable': 2,
    'valid-typeof': 2,
    'quote-props': [ 2, 'as-needed' ],
    'one-var': [ 2, 'never' ],
    'prefer-arrow-callback': 2,
    'prefer-const': [ 2, { destructuring: 'all' } ],
    'arrow-spacing': 2,
    'no-inner-declarations': 0,
    'no-console': 'off',
    'no-unused-vars': [ 'error', { args: 'none' } ],
  },
  settings: {},
  extends: [ 'eslint:recommended', 'prettier' ]
}
