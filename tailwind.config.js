/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#EBBC43',
        'primary-hover': '#F5DA8F',
      'secondary': '#292929',
      'secondary-hover': '#3C3C3C',
      'back-gray': "#151515",
      'gray-empty': '#3c3c3c',
      'light': '#F7F7F7',
      },
      height: {
        '9/10': '90%',
      },
      gridTemplateRows: {
'footer': 'auto, 1fr, 1fr'
      }
    },
  },
    colors: {
      'red': '#FF6565',
      'gray': '#151515',
      'yellow': '#EBBC43',
     
    },
  plugins: [],
}
