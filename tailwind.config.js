/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        note: '0 12px 0 rgba(34, 30, 24, 0.08), 0 18px 30px rgba(79, 64, 28, 0.14)',
        card: '0 12px 22px rgba(68, 53, 25, 0.12)',
      },
      colors: {
        paper: '#f8f1d5',
        cream: '#fff8e8',
        mustard: '#f3c75c',
        ink: '#1d1a17',
        rose: '#f8d3b2',
        mint: '#d9f3d7',
        sky: '#dfeefb',
        lilac: '#e7e0ff',
      },
    },
  },
  plugins: [],
}
