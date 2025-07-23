module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  runner: "@pixi/jest-electron/runner",
  testEnvironment: "@pixi/jest-electron/environment",
  testMatch: ["**/__tests__/visual/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(pixi\\.js|earcut|@pixi)/)"],
  setupFilesAfterEnv: [],
  testTimeout: 30000,
  verbose: true,
  collectCoverage: false,
  globals: {
    "ts-jest": {
      tsconfig: {
        target: "es2020",
        module: "commonjs",
        lib: ["es2020", "dom"],
        moduleResolution: "node",
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        skipLibCheck: true,
        strict: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
    },
  },
};
