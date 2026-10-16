import js from '@eslint/js';
import ts from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: [
      'dist',
      'node_modules',
      '.next/',
      '.source/',
      'out/',
      'next.config.mjs',
      'postcss.config.js',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    settings: {
      react: {
        version: '19.3.0',
      },
      tailwindcss: {
        config: './tailwind.config.js',
        callees: ['clsx', 'cva', 'cn'],
      },
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      'import/no-extraneous-dependencies': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'import/no-default-export': 'off',
      'react/prop-types': 'off',
      'import/default': 'off',
      'import/export': 'off',
      'import/namespace': 'off',
      'import/no-unresolved': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    rules: {
      'no-console': 'off',
      'import/no-relative-packages': 'off',
    },
  },
];
