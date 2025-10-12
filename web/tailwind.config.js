/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          DEFAULT: '#f97316',
          dark: '#ea580c'
        },
        ink: '#1f2933',
        clay: '#fef3c7'
      },
      backgroundImage: {
        'grainy': "url('https://www.transparenttextures.com/patterns/cream-paper.png')"
      }
    }
  },
  plugins: []
};

