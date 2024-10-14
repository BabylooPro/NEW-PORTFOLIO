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
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	moduleNameMapper: {
		"^.+\\.(css|less|scss)$": "identity-obj-proxy",
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
	testEnvironmentOptions: {
		url: "http://localhost/",
	},
	setupFiles: ["dotenv/config"],
};

export default config;
