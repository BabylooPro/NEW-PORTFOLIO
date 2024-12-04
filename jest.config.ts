import type { Config } from "jest";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const config: Config = {
	clearMocks: true,
	collectCoverage: true,
	verbose: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	preset: "ts-jest",
	testEnvironment: process.env.TEST_ENV === 'jsdom' ? 'jsdom' : 'node',
	transform: {
		"^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	moduleNameMapper: {
		"^.+\\.(css|less|scss)$": "identity-obj-proxy",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	setupFilesAfterEnv: [
		process.env.TEST_TYPE === 'integration' 
			? '<rootDir>/setupIntegrationTests.ts'
			: '<rootDir>/setupTests.ts'
	],
	testEnvironmentOptions: {
		url: "http://localhost/",
	},
	setupFiles: ["dotenv/config"],
	maxWorkers: 2,
	maxConcurrency: 1,
	workerIdleMemoryLimit: "512MB",
	transformIgnorePatterns: [
		'/node_modules/(?!(node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill)/)'
	],
};

export default config;
