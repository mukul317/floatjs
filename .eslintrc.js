// Severity should be one of the following: 0 = off, 1 = warn, 2 = error
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "standard",
    "plugin:@typescript-eslint/recommended"
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
    include: [
      "src/**/*.ts"
    ],
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    "no-new": 0,
    "semi": ["error", "always"],
    "indent": ["error", 4],
    "quotes": ["error", "double"]
  }
}
