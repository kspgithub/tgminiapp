/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tg-bg': 'var(--tg-color-bg)',
        'tg-text': 'var(--tg-color-text)',
        'tg-hint': 'var(--tg-color-hint)',
        'tg-link': 'var(--tg-color-link)',
        'tg-button': 'var(--tg-color-button)',
        'tg-button-text': 'var(--tg-color-button-text)',
        'tg-secondary-bg': 'var(--tg-color-secondary-bg)',
      }
    },
  },
  plugins: [],
}