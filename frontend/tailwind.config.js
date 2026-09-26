/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f7fb',
          100: '#e6edf7',
          200: '#c7d6ea',
          300: '#9bb4d4',
          400: '#6a8db8',
          500: '#4a6f9c',
          600: '#385780',
          700: '#2e4668',
          800: '#293c56',
          900: '#253448',
          950: '#182230',
        },
        signal: {
          real: '#1f8a5b',
          fake: '#c43c3c',
          uncertain: '#c48a1f',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(74, 111, 156, 0.25)',
      },
    },
  },
  plugins: [],
};
