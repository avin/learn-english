module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cn'],

  printWidth: 100,
  singleQuote: true,

  importOrder: ['^react', '<THIRD_PARTY_MODULES>', '^@/(.*)$', '\\.s?css$', '^[./]'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};
