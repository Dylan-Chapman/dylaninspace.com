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
        "cosmos-primary": "#003049",
        "cosmos-secondary": "#B2A4FF",
        "cosmos-accent": "#FFB4B4",
        "cosmos-dark": "#000E14",
        "cosmos-white": "#ffffff",
      },
      aspectRatio: {
        "9/10": "9 / 16",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
