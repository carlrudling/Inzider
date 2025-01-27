/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
      },
      colors: {
        'custom-orange': '#FF9F1C',
        'custom-purple': '#6B21A8',
        'text-color1': '#4A5568',
      },
      lineHeight: {
        custom: '1.3',
      },
    },
  },
  plugins: [],
};
