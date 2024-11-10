/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  // transformIgnorePatterns: ['<rootDir>/node_modules/(?!(d3-selection))/'],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    // '^d3-(.+)$': '<rootDir>/node_modules/d3-$1/dist/d3-$1.min.js',
    // This fixes an issue with the d3-selection not compiling correctly with jest
    '^d3-selection$':
      '<rootDir>/node_modules/d3-selection/dist/d3-selection.min.js',
  },
};
