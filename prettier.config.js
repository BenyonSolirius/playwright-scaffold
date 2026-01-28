// This is entirely configurable, the main purpose of prettier
// is to ensure a common standard is followed across the project
// and to reduce any issues that may occur with Git because of
// trailing spaces and lines.

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 110,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
};

export default config;
