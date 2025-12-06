/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./**/*.js",
    "./**/*.ts",
    "./**/*.jsx",
    "./**/*.tsx",
    "./assets/**/*.{html,js}",
    "./module/**/*.{html,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
