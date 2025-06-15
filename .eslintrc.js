module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Added node for configuration files
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'warn', // Show Prettier issues as warnings
    // Add any custom ESLint rules here if needed
  },
};
