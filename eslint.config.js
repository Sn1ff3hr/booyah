module.exports = [
    {
        files: ['./*.js', './js/**/*.js'], // More specific file targeting
        ignores: [
            'node_modules/**/*', // Ignore all files and subdirectories in node_modules
            'inventory_project/frontend/inventory-app/**/*.js', // More specific glob ignore
            'inventory_project/frontend/inventory-app/**/*.jsx', // Also ignore jsx if any
        ],
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
