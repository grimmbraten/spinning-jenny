const config = {
  displayName: 'JEST',
  verbose: true,
  collectCoverage: true,
  testTimeout: 10000,
  setupFilesAfterEnv: ['./tests/setup.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/', '/src/services/', '/src/helpers/']
};

module.exports = config;
