/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Paleta tomada del sitio público (app.css).
      colors: {
        brand: {
          DEFAULT: '#4E342E',
          light: '#6D4C41',
          dark: '#3B2A22',
          gold: '#C9A37A',
        },
        cream: '#F5EFE6',
        sand: '#EFE6DA',
        ink: '#4E342E',
        'ink-soft': '#6D4C41',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 14px 44px rgba(78,52,46,.10)',
        strong: '0 22px 60px rgba(78,52,46,.20)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in .2s ease',
        'slide-up': 'slide-up .25s cubic-bezier(.2,.7,.2,1)',
      },
    },
  },
  plugins: [],
};
