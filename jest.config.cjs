module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testMatch: ['**/src/tests/**/*.test.(js|jsx)'],
  transformIgnorePatterns: ['/node_modules/']
};
