/** @type {import('tailwindcss').Config} */
const tuxPreset = require('@byted-tiktok/tux-web/tailwind-preset')

module.exports = {
  presets: [tuxPreset],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
