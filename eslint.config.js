// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
// For eslint-config-prettier, its main purpose is to provide rules that disable ESLint's stylistic rules.
// In flat config, you often import it and spread its rules into your rules object.
import prettierConfig from 'eslint-config-prettier'; // This typically exports the rules object

export default [
  js.configs.recommended, // ESLint's recommended configurations
  {
    // Configuration mimicking "plugin:prettier/recommended"
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules, // Spread rules from eslint-config-prettier
      'prettier/prettier': 'warn', // Or 'error'. Let's use 'warn' for now.
    },
  },
  {
    // Custom configurations for JS/TS/JSX/TSX files
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    ignores: [
      'node_modules/**/*',
      'inventory_project/frontend/inventory-app/**/*', // Ignore the React app entirely
      '**/dist/**/*', // Common practice to ignore dist folders
      '**/build/**/*', // Common practice to ignore build folders
      // Add other specific ignores if needed, like coverage reports, etc.
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022, // Using a specific recent year for globals
      },
      // If using TypeScript or JSX, parser options would be needed here,
      // e.g., parser: require.resolve('@typescript-eslint/parser') for TS,
      // or settings for JSX. However, the current setup doesn't include TS/JSX parsers.
      // This config will primarily work for JS files.
      // For JSX/TSX, it would need @eslint/js's parser to support it or a specific parser.
      // ESLint's default parser (espree) supports JSX if sourceType: 'module' and ecmaVersion is recent.
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      // Any other custom project-specific rules
    },
  },
];
