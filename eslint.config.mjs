// Flat config (ESLint 9+). Formatting is owned by Prettier (.prettierrc),
// so no stylistic rules are defined here.
import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

const tsRules = {
  ...tsPlugin.configs.recommended.rules,
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  // TypeScript already reports undefined/redeclared identifiers.
  'no-undef': 'off',
  'no-unused-vars': 'off',
};

export default [
  { ignores: ['dist/**', 'node_modules/**', 'assets/**', 'public/**'] },

  js.configs.recommended,

  // Browser + WebExtension sources.
  {
    files: ['src/**/*.{ts,vue}', 'plugins/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.webextensions },
    },
  },

  {
    files: ['**/*.ts'],
    languageOptions: { parser: tsParser },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: tsRules,
  },

  ...vuePlugin.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser, ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsRules,
      // App-level single-word names (Popup) are fine; this rule targets
      // shared component libraries.
      'vue/multi-word-component-names': 'off',
    },
  },

  // Node-side tooling: build scripts and root config files are CommonJS.
  {
    files: ['scripts/**/*.js', '*.config.js', '*.config.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },

  // This config file itself is ESM.
  {
    files: ['*.config.mjs', 'vite.config.ts'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...globals.node } },
  },
];
