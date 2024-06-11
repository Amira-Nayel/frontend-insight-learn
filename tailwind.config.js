/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // or 'media'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      c_1: "#060B7D",
      c_2:  "#1E3C85",
      c_3:  "#070D57",
      c_4: "#59bada",
      c_5: "#e9f2ff",
      black: "#000000",
      white: "#ffffff"
    },
    extend: {
      colors: {
        dark: {
          c_1: "#060B7D",
          c_2:  "#1E3C85",
          c_3:  "#070D57",
          c_4: "#59bada",
          c_5: "#e9f2ff",
          black: "#ffffff",
          grey:"#222831",
          white: "#000000",
          text:"#ffffff",
        },
      },
    },
  },
  plugins: [],
}