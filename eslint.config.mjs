import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
    'no-cond-assign': 'off',
    'ts/no-use-before-define': 'off',
    'eqeqeq': 'warn',
    'ts/prefer-literal-enum-member': 'off',
  },
  ignores: ['**/node_modules/**', '**/dist/**', '**/public/**'],
})
