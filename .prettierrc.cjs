module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],

  printWidth: 100,
  singleQuote: true,

  importOrder: ['^react', '<THIRD_PARTY_MODULES>', '^@/(.*)$', '\\.s?css$', '^[./]'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};
