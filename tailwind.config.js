/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0c0b0a',
        text: '#f7f4ef',
        primary: {
          50: '#fdf8ef',
          100: '#f9eed8',
          200: '#f0d9a8',
          300: '#e4c078',
          400: '#d4a853',
          500: '#c4923a',
          600: '#a67c2e',
          700: '#8a6628',
          800: '#715324',
          900: '#5c4320',
          950: '#352614',
        },
        gold: {
          300: '#f5e6c4',
          400: '#e8d5a8',
          500: '#d4bc82',
          600: '#b89d5e',
        },
        accent: {
          400: '#a8bfb4',
          500: '#8aa899',
        },
        forest: {
          100: '#f0ebe4',
          300: '#b5aea3',
          400: '#8a8278',
          500: '#5c554d',
          600: '#3d3833',
          700: '#2d2925',
          800: '#1e1b18',
          900: '#12100e',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.25)',
        'card-hover': '0 8px 28px rgba(0,0,0,0.45)',
        'glow-primary': '0 0 24px rgba(212, 168, 83, 0.22)',
        'glow-gold': '0 0 20px rgba(232, 213, 168, 0.2)',
        elevated: '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'hero-pattern': 'radial-gradient(ellipse at 50% -10%, rgba(212,168,83,0.14) 0%, transparent 55%)',
      },
      keyframes: {
        'badge-pop': {
          '0%': { transform: 'scale(0)' },
          '70%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'badge-pop': 'badge-pop 0.3s ease-out',
        'scale-in': 'scale-in 0.15s ease-out',
        'fade-up': 'fade-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
