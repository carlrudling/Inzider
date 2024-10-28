import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        sourceSansPro: ['Source Sans Pro', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'custom-green': '#5CBF9E',
        'custom-white-green': '#EFF9F6',
        'custom-blue2': '#7871F7',
        'custom-white-blue2': '#F1F0FE',
        'custom-red': '#E85A68',
        'custom-white-red': '#FCEFF1',
        'custom-yellow': '#F1BE42',
        'custom-white-yellow': '#FFF9ED',
        'custom-blue': '#49A8EF',
        'custom-white-blue': '#EDF7FE',
        'custom-purple': '#BA05F9',
        'custom-white-purple': '#F9E7FF',
        'custom-blue3': '#0362FF',
        'custom-white-blue3': '#E5EFFE',
        'custom-orange': '#E98639',
        'custom-white-orange': '#FEF3EA',
        'custom-new-lightblue': '#E1F1F1',
        'custom-new-blue': '#BFDFDE',
        'custom-new-darkPurple': '#2E334A',
        'custom-new-lightBeige': '#E7ECE4',
        'custom-new-beige': '#D7C49F',
        'custom-new-yellow': '#FEF4DF',
        cta: '#0066FF',
        'text-color1': '#9B9B9B',
        'text-color2': '#333333',

        'background-white': '#FBFBFB',
      },
      lineHeight: {
        custom: '1.75', // Add your custom line-height value here
      },
      width: {
        '140': '140px', // Add a custom width utility
      },
    },
  },
  plugins: [],
};

export default config;
