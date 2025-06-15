// eslint.config.js
import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier"; // This is eslint-config-prettier

export default [
  js.configs.recommended, // Base ESLint recommended rules
  {
    files: ["**/*.js"], // Apply the following only to .js files at the root
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "prettier/prettier": "warn" // Show Prettier differences as warnings
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly"
      }
    }
  },
  prettierConfig // This disables ESLint rules that conflict with Prettier
];
