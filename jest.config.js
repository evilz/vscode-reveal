/* eslint-env node */
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.jest.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePathIgnorePatterns: ['/dist/'],
  verbose: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/test/**/*.ts'],
  testResultsProcessor: 'jest-sonar-reporter',
  coverageDirectory: './coverage',
  //setupTestFrameworkScriptFile: '@alex_neo/jest-expect-message',
  setupFilesAfterEnv: ['@alex_neo/jest-expect-message'],
  moduleNameMapper: {
    '^open$': '<rootDir>/src/__mocks__/open.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['@swc/jest', {
      jsc: {
        parser: { syntax: 'typescript' },
        target: 'es2020',
      },
    }],
  },
}
