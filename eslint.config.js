// eslint.config.js
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single']
    }
  }
]