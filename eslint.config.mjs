import typescriptEslint from '@typescript-eslint/eslint-plugin';
import eslintComments from 'eslint-plugin-eslint-comments';
import jest from 'eslint-plugin-jest';
import promise from 'eslint-plugin-promise';
import unicorn from 'eslint-plugin-unicorn';
import jestDom from 'eslint-plugin-jest-dom';
import _import from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.eslintrc.js', '**/vite.config.ts'],
  },
  ...compat.extends(
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:jest-dom/recommended',
    'plugin:unicorn/recommended',
    'prettier'
  ),
  {
    files: ['src/**/*.js', 'src/**/*.ts', 'src/**/*.jsx', 'src/**/*.tsx'],

    plugins: {
      '@typescript-eslint': typescriptEslint,
      'eslint-comments': eslintComments,
      jest,
      promise,
      unicorn,
      'jest-dom': jestDom,
      import: fixupPluginRules(_import),
      react,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'commonjs',
    },

    rules: {
      'no-use-before-define': 0,
      'react/prop-types': 0,
      'unicorn/filename-case': 0,
      'unicorn/no-array-for-each': 0,
      'no-prototype-builtins': 'off',
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error',
      'react/destructuring-assignment': 'off',
      'react/jsx-filename-extension': 'off',

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],

      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: true,
          variables: true,
          typedefs: true,
        },
      ],

      'unicorn/prevent-abbreviations': 'off',
    },
  },
];
