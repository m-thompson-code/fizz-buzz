// jest.config.js
module.exports = {
    preset: 'jest-preset-angular',
	testMatch: ['**/+(*.)+(spec).+(ts)'],
	setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
	collectCoverage: true,
	coverageReporters: ['html'],
	coverageDirectory: 'coverage/fizz-buzz-demo',
};
