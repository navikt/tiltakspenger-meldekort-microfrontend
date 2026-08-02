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
        ignores: ["dist", ".astro", "*.cjs", "*.mjs", "*.js", "env.d.ts", "tests"],
    },
    // .astro-filene må ha sin egen blokk: globen under dekker kun ts/tsx/js/jsx, så uten denne
    // ble malene aldri linta. flat/recommended tar med astro-parseren selv, slik at
    // astro-eslint-parser ikke må deklareres som egen avhengighet under pnpm.
    ...eslintPluginAstro.configs["flat/recommended"],
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
            // Astro-reglene hører hjemme i .astro-blokka over, ikke her - de har ingen
            // effekt på ts/tsx og skjulte at malene i praksis var ulinta.
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
