/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    backgroundSize: {
      "gradient-dashed": "20px 2px, 100% 2px",
    },
    extend: {
      boxShadow: {
        "cosmos-shadow": "0px 25px 50px -12px rgba(0, 0, 0, 0.3)",
      },
      fontFamily: {
        "cosmos-inter": ['"Inter"', "sans-serif"],
        "cosmos-space": ['"Space Grotesk"', "sans-serif"],
      },
      colors: {
        "cosmos-primary": "#221F3B",
        "cosmos-secondary": "#4A6CF7",
        "cosmos-accent": "#FF5C8A",
        "cosmos-dark": "#050D1F",
        "cosmos-white": "#ffffff",
      },
      aspectRatio: {
        "9/10": "9 / 16",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
