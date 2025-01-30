module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['unused-imports'],
  parserOptions: {
    ecmaVersion: 11,
  },
  env: {
    node: true,
  },
  ignorePatterns: [
    '.eslintrc.js', // https://stackoverflow.com/q/63118405
    'jest.config.js',
    'dist/**',
  ],

  rules: {
    curly: ['error', 'multi-line'],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};

