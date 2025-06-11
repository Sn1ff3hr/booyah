module.exports = [
  {
    files: ['**/*.js'],
    ignores: [],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      'no-unused-vars': 'warn'
    }
  }
];
