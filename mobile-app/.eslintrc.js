// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  plugins: ['unused-imports'],
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
