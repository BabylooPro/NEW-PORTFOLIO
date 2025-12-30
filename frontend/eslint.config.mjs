import { FlatCompat } from "@eslint/eslintrc";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const config = [
    {
        ignores: ["**/.next/**", "**/out/**", "**/coverage/**", "**/build/**", "**/dist/**"],
    },
    ...compat.extends("next/core-web-vitals"),
    {
        linterOptions: {
            reportUnusedDisableDirectives: false,
        },
        rules: {
            "react-hooks/set-state-in-effect": "off",
            "react-hooks/static-components": "off",
            "react-hooks/purity": "off",
            "react-hooks/refs": "off",
            "react-hooks/preserve-manual-memoization": "off",
            "react-hooks/error-boundaries": "off",
            "react-hooks/incompatible-library": "off",
            "react-hooks/immutability": "off",
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "@typescript-eslint": tseslintPlugin,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
];

export default config;
