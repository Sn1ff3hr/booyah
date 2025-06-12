module.exports = [
    {
        files: ['**/*.js'],
        ignores: ['node_modules/'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        rules: {
            'no-unused-vars': 'warn',
            'prettier/prettier': 'error',
        },
        plugins: {
            prettier: require('eslint-plugin-prettier'),
        },
    },
    require('eslint-config-prettier'),
];
