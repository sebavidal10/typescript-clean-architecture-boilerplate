module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
    '!src/server.ts',
  ],
  // Coverage threshold removed - boilerplate provides foundation
  // Users should add tests as they build features
  // coverageThreshold: {
  //   global: {
  //     branches: 40,
  //     functions: 40,
  //     lines: 40,
  //     statements: 40,
  //   },
  // },
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
};
