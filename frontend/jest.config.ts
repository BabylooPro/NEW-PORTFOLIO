import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
    dir: "./",
});

const config: Config = {
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transformIgnorePatterns: [
        "node_modules/(?!(node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill)/)"
    ],
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    moduleDirectories: ["node_modules", "<rootDir>/"],
};

export default createJestConfig(config);
