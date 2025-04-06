/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html', // все html-файлы в корне
    './**/*.{js,jsx,ts,tsx,html}', // все html-файлы во всех подпапках
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

