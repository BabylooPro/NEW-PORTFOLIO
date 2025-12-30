import { FlatCompat } from "@eslint/eslintrc";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

let nextVitals;
try {
    const nextVitalsModule = await import("eslint-config-next/core-web-vitals");
    nextVitals = nextVitalsModule.default ?? nextVitalsModule;
} catch {
    const nextVitalsModule = await import("eslint-config-next/core-web-vitals.js");
    nextVitals = nextVitalsModule.default ?? nextVitalsModule;
}

const nextConfig = Array.isArray(nextVitals) ? nextVitals : compat.extends("next/core-web-vitals");

const config = defineConfig([
    ...nextConfig,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "coverage/**", "dist/**"]),
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
]);

export default config;
