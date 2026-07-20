const eslint = require('@eslint/js')
const typescriptEslint = require('@typescript-eslint/eslint-plugin')
const typescriptParser = require('@typescript-eslint/parser')
const jest = require('eslint-plugin-jest')
const sonarjs = require('eslint-plugin-sonarjs')
const prettier = require('eslint-config-prettier')

const typescriptFiles = ['src/**/*.ts']
const withTypescriptFiles = (config) => ({ ...config, files: typescriptFiles })

module.exports = [
  {
    ignores: ['*.config.js', 'coverage/**', 'dist/**', 'eslint.config.js', 'libs/**', 'node_modules/**', 'out/**'],
  },
  withTypescriptFiles(eslint.configs.recommended),
  ...typescriptEslint.configs['flat/recommended'].map(withTypescriptFiles),
  {
    ...sonarjs.configs.recommended,
    files: ['src/**/*.ts'],
    ignores: ['src/test/**/*.ts'],
    rules: {
      ...sonarjs.configs.recommended.rules,
      'sonarjs/cognitive-complexity': ['error', 20],
      'sonarjs/disabled-auto-escaping': 'off',
      'sonarjs/function-return-type': 'off',
    },
  },
  {
    files: typescriptFiles,
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
  },
  {
    ...jest.configs['flat/recommended'],
    files: ['src/test/**/*.ts'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'jest/valid-expect': 'off',
    },
  },
  withTypescriptFiles(prettier),
]
