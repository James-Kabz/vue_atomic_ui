import js from '@eslint/js'
import vue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    ignores: ['dist/**', 'node_modules/**', '.git/**']
  },
  {
    rules: {
      // Add any custom rules here
    }
  }
]