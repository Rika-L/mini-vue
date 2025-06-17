import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
    'no-cond-assign': 'off',
  },
  ignores: ['**/node_modules/**', '**/dist/**', '**/public/**'],
})
