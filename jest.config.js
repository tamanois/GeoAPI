module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*(spec|e2e-spec)\\.ts$',
  collectCoverageFrom: ['src/**/*.{ts,js}'],
};
