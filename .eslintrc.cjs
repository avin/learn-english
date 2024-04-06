module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-explicit-any': 0,
    'no-empty-pattern': 0,
    'no-console': ['warn', { allow: ['warn', 'error', 'info', 'dir'] }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    '@typescript-eslint/no-unused-vars': [1, { args: 'none', ignoreRestSiblings: true }],
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false,
        },
      },
    ],
    'react/button-has-type': 1,
    '@typescript-eslint/no-floating-promises': 'error',
  },
  overrides: [
    {
      files: ['*.stories.tsx'],
      rules: {
        'no-console': 0,
      },
    },
  ],
};
