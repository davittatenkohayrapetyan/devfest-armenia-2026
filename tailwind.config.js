/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,js}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        df: {
          blue: "#4285f4",
          green: "#34a853",
          yellow: "#f9ab00",
          red: "#ea4335",
          light: "#f0f0f0",
          dark: "#1e1e1e",
        },
      },
      fontFamily: {
        sans: ['"Google Sans"', "Roboto", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
