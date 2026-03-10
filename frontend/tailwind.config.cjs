/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lora', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Courier Prime"', 'monospace'],
      },
      colors: {
        cafe: {
          brown: '#6F4E37',
          cream: '#F5F0E8',
          dark: '#2C1810',
        },
        rustic: {
          linen: '#FAF0E6',
          wood: '#5C4033',
          woodDark: '#3E2723',
          'wood-light': '#6F4E37',
          olive: '#556B2F',
          beige: '#C4A77D',
          sand: '#D4C4A8',
          cream: '#FAF6ED',
          paper: '#F5F0E6',
          ink: '#2C1810',
          inkSoft: '#3E2723',
        },
      },
      boxShadow: {
        rustic: '0 2px 8px rgba(92,64,51,0.15), 0 1px 3px rgba(92,64,51,0.10)',
        'rustic-lg': '0 4px 16px rgba(92,64,51,0.20), 0 2px 6px rgba(92,64,51,0.15)',
      },
      backgroundImage: {
        'paper-texture':
          'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(92,64,51,0.015) 2px,rgba(92,64,51,0.015) 4px),repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(92,64,51,0.01) 3px,rgba(92,64,51,0.01) 6px)',
      },
    },
  },
  plugins: [],
};
