/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cafe: {
          brown: '#6F4E37',
          cream: '#F5F0E8',
          dark: '#2C1810',
        },
      },
    },
  },
  plugins: [],
};
