module.exports = {
  testEnvironment: "node",
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
    ]
  },
  collectCoverageFrom: ["src/**/*.ts"]
}
