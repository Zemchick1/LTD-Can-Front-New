module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    collectCoverage: true,
    collectCoverageFrom: "./src",
    coverageDirectory: '.scannerwork/coverage',
    coverageReporters: ['lcov'],
    reporters: [
        'default',
        ['jest-sonar', { outputDirectory: '.scannerwork', outputName: 'sonar-report.xml' }]
    ],
};
