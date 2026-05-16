module.exports = {
  root: true,
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'no-unused-vars': 0,
      },
    },
  ],
  rules: {
    'import/extensions': [2, 'ignorePackages', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'func-names': 0,
    'new-cap': [2, { newIsCap: true, capIsNew: true, capIsNewExceptions: ['List', 'Map'] }],
    'linebreak-style': 0,
    'arrow-parens': 0,
    'default-param-last': 0,
    'function-paren-newline': 0,
    'import/no-cycle': 0,
    'import/no-useless-path-segments': 0,
    'jsx-a11y/iframe-has-title': 0,
    'lines-between-class-members': 0,
    'max-len': 0,
    'no-multiple-empty-lines': 0,
    'no-plusplus': 0,
    'no-restricted-globals': 0,
    'no-underscore-dangle': 0,
    'operator-linebreak': 0,
    'object-curly-newline': 0,
    'prefer-destructuring': 0,
    'comma-dangle': 0,
    'react/destructuring-assignment': 0,
    'react/forbid-prop-types': 0,
    'react/no-danger': 0,
    'react/no-unused-class-component-methods': 0,
    'react/no-unused-prop-types': 0,
    'react/require-default-props': 0,
    'react/sort-comp': 0,
    'react/no-array-index-key': 0,
    'react/jsx-wrap-multilines': 0,
  },
};
