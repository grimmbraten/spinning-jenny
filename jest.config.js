const config = {
  displayName: 'JEST',
  verbose: true,
  collectCoverage: true,
  testTimeout: 10000,
  setupFilesAfterEnv: ['./tests/setup.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/', '/src/services/', '/src/helpers/'],
  moduleNameMapper: {
    '~root': '<rootDir>',
    '~helpers': '<rootDir>/src/helpers',
    '~actions/(.*)': '<rootDir>/src/actions/$1',
    '~commands/(.*)': '<rootDir>/src/commands/$1',
    '~services/(.*)': '<rootDir>/src/services/$1'
  }
};

module.exports = config;
