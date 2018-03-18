module.exports = {
  parser: 'babel-eslint',

  extends: [
    'airbnb',
    'plugin:css-modules/recommended',
  ],

  plugins: [
    'css-modules',
  ],

  globals: {
    __DEV__: true,
  },

  env: {
    browser: true,
  },

  rules: {
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
        mjs: 'never',
      },
    ],
    'import/no-extraneous-dependencies': 'off',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'react/jsx-filename-extension': 'off',
    'react/prefer-stateless-function': 'off',
  },
};
