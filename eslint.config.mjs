import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
    'no-cond-assign': 'off',
    'ts/no-use-before-define': 'off',
    'eqeqeq': 'warn',
  },
  ignores: ['**/node_modules/**', '**/dist/**', '**/public/**'],
})
