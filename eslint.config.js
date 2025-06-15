// eslint.config.js
import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier'; // This is eslint-config-prettier

export default [
  js.configs.recommended, // Base ESLint recommended rules
  {
    files: ['**/*.js'], // Apply the following only to .js files
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prettier/prettier': 'warn' // Show Prettier differences as warnings
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly' // 'no-console': 'off' allows use, 'readonly' prevents reassigning console
      }
    }
  },
  prettierConfig // This disables ESLint rules that conflict with Prettier
  // It needs to be a config object itself, not just rules.
  // The import 'eslint-config-prettier' should provide this.
];
