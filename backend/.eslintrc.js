// .eslintrc.js

module.exports = {
  root: true,

  env: {
    node: true,
    es2022: true,
  },

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'commonjs',
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended', // Mantener si aún quieres que Prettier desactive reglas conflictivas.
  ],

  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.git/', 'coverage/'],
  rules: {
    'consistent-return': 'off', // Desactiva la regla de retorno consistente
    'no-console': 'off', // Permite el uso de console.log
  },
}
