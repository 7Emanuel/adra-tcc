/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'adra-green': '#0A6159',
        'adra-green-light': '#2AB3A3',
        'adra-accent': '#F5B700',
        'adra-bg': '#F4F6F8',
        'adra-text': '#1F2937',
        'adra-text-secondary': '#475569',
      },
    },
  },
  plugins: [],
}
