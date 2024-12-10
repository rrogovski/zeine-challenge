import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  // rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  // moduleNameMapper: {
  //   '@src/(.*)': ['<rootDir>/$1'],
  //   '@application/(.*)': ['<rootDir>/application/$1'],
  //   '@infra/(.*)': ['<rootDir>/infra/$1'],
  //   '@helpers/(.*)': ['<rootDir>/helpers/$1'],
  //   '@test/(.*)': ['<rootDir>/../test/$1'],
  // },
};

export default config;
