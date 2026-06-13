/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f5dba8',
          300: '#f0c46f',
          400: '#ebab42',
          500: '#e6941f',
          600: '#cc7a14',
          700: '#a86011',
          800: '#864c12',
          900: '#6c3e12',
        },
        ink: {
          50:  '#f4f4f6',
          100: '#e8e8ec',
          200: '#d0d0db',
          300: '#a8a8be',
          400: '#7b7b9f',
          500: '#575780',
          600: '#464666',
          700: '#38384f',
          800: '#232333',
          900: '#13131e',
        },
      },
    },
  },
  plugins: [],
}
