module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript', 'prettier'],
  plugins: ['import', 'react'],
  env: { browser: true },
  parserOptions: {
    project: './tsconfig.lint.json',
  },
  rules: {
    'no-else-return': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/label-has-associated-control': 'off', // seems to be buggy?
    'import/prefer-default-export': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      rules: {
        'import/no-extraneous-dependencies': ['error', {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        }],
      },
    },
  ],
};
