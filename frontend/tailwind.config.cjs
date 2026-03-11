/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lora', 'Georgia', 'serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['Courier Prime', 'Courier New', 'monospace'],
      },
      colors: {
        rustic: {
          wood: '#5C4033',
          woodLight: '#6F4E37',
          woodDark: '#4A3728',
          olive: '#556B2F',
          oliveLight: '#6B7B3C',
          beige: '#C4A77D',
          sand: '#D4C4A8',
          cream: '#FAF6ED',
          paper: '#F5F0E6',
          linen: '#FDF8F3',
          ink: '#2C1810',
          inkSoft: '#3E2723',
        },
        cafe: {
          brown: '#6F4E37',
          cream: '#F5F0E8',
          dark: '#2C1810',
        },
      },
      backgroundImage: {
        'paper-texture': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
      },
      boxShadow: {
        rustic: '0 2px 8px rgba(44, 24, 16, 0.08), 0 1px 2px rgba(44, 24, 16, 0.04)',
        'rustic-lg': '0 4px 20px rgba(44, 24, 16, 0.1), 0 2px 4px rgba(44, 24, 16, 0.06)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
};
