import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintPluginAstro from "eslint-plugin-astro";
import cssModules from "eslint-plugin-css-modules";
import globals from "globals";

const parserOptions = {
    ecmaVersion: "latest",
    sourceType: "module",
};

export default [
    {
        ignores: ["dist", "*.cjs", "*.mjs", "*.js", "env.d.ts", "tests"],
    },
    {
        files: ["src/**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions,
            globals: {
                ...globals.browser,
                ...globals.es2020,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "css-modules": cssModules,
            astro: eslintPluginAstro,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...eslintPluginAstro.configs.recommended.rules,
            ...cssModules.configs.recommended.rules,
            "no-undef": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^(_|req|res|next)$" },
            ],
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/triple-slash-reference": "off",
        },
    },
];
