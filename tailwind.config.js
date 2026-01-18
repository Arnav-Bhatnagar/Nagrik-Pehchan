/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tricolor: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          'saffron-dark': '#E68B2A',
          'green-dark': '#0F5C06',
        }
      }
    },
  },
  plugins: [],
};
