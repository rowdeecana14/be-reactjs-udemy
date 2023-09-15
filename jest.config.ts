import type { Config } from "jest";

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["src/v1/"],
  coverageReporters: ["clover", "json", "lcov", "text"],
  moduleFileExtensions: ["ts", "js"],
  // setupFiles: ['./jest.setup.ts']
  testMatch: ['<rootDir>/src/v1/__tests__/**/*.ts'],
  // forceExit: true
};

export default config;
