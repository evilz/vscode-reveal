/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [ "**/*.jesty.ts" ],
  verbose: true
};


// "jest": {
//   "verbose": true,
//   "preset": "ts-jest",
//   "testMatch": [
//     "**/*.jest.ts"
//   ],
//   "coverageReporters": [
//     "lcov",
//     "text"
//   ],
//   "collectCoverageFrom": [
//     "**/src/**/*.ts",
//     "!**/node_modules/**",
//     "!**/vendor/**"
//   ],
//   "reporters": [
//     "default",
//     "jest-junit"
//   ]
// },