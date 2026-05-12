import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  transformIgnorePatterns: ['node_modules/(?!(jose|better-auth)/)'],

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  testRegex: '.*\\.spec\\.ts$',

  testPathIgnorePatterns: ['/node_modules/'],

  verbose: true,
};

export default config;
