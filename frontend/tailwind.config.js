/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#171717',
        secondary: '#272727',
        logo: '#FF7878',
        logoDark: '#A70808',
        'dark-subtle': 'rgba(255, 255, 255, 0.5)',
        'light-subtle': 'rgba(39, 39, 39, 0.5)',
      },
      fontFamily: {
        logo: ['Luckiest Guy', 'cursive'],
      },
    },
  },
  plugins: [],
};
