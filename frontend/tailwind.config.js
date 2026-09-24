/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: '#ea580c', // Main brand color
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fae1e1',
          200: '#f4c8c8',
          300: '#eda3a3',
          400: '#e17272',
          500: '#d04949',
          600: '#b93333',
          700: '#9c2828',
          800: '#802323', // Deep Maroon
          900: '#6b2222',
          DEFAULT: '#802323',
        },
        gold: {
          50: '#fbf9f1',
          100: '#f5efdf',
          200: '#ecdec1',
          300: '#dfc69d',
          400: '#d1ab75',
          500: '#c59556',
          600: '#b98048',
          700: '#9b643d',
          800: '#815136',
          900: '#69432f',
          DEFAULT: '#d1ab75', // Standard gold
        },
        ivory: '#FFFFF0',
        charcoal: '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        hindi: ['Yatra One', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
