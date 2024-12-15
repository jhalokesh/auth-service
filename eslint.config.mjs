// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // 'no-console': 'error',
            '@typescript-eslint/no-misused-promises': 'off',
        },
    },
    {
        ignores: [
            'node_modules',
            'dist',
            'scripts/',
            'eslint.config.mjs',
            'jest.config.js',
        ],
    }
);
