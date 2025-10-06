/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial ADRA Brasil
        'adra-green': '#007B4B', // primária
        'adra-gold': '#FFC60B',  // destaque
        'adra-white': '#FFFFFF',
        'adra-gray-light': '#F5F5F5',
        'adra-gray-dark': '#333333',
      },
    },
  },
  plugins: [],
}
