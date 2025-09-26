const cosmosPrimary = {
  50: "#E9E9EB",
  100: "#C8C7CE",
  200: "#A7A5B1",
  300: "#858493",
  400: "#59576C",
  500: "#221F3B",
  600: "#1D1A32",
  700: "#181629",
  800: "#131120",
  900: "#0E0C18",
  950: "#09080F",
};

const cosmosSecondary = {
  50: "#EDF0FE",
  100: "#D2DAFD",
  200: "#B7C4FC",
  300: "#9BAEFB",
  400: "#7791F9",
  500: "#4A6CF7",
  600: "#3F5CD2",
  700: "#344CAD",
  800: "#293B88",
  900: "#1E2B63",
  950: "#131B3E",
};

const cosmosAccent = {
  50: "#FFEFF3",
  100: "#FFD6E2",
  200: "#FFBED0",
  300: "#FFA5BF",
  400: "#FF85A7",
  500: "#FF5C8A",
  600: "#D94E75",
  700: "#B34061",
  800: "#8C334C",
  900: "#662537",
  950: "#401723",
};

const cosmosDark = {
  50: "#E6E7E9",
  100: "#C1C3C7",
  200: "#9B9EA5",
  300: "#767A84",
  400: "#444A57",
  500: "#050D1F",
  600: "#040B1A",
  700: "#040916",
  800: "#030711",
  900: "#02050C",
  950: "#010308",
};

const withDefault = (scale) => ({ DEFAULT: scale[500], ...scale });

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
        cosmos: {
          primary: cosmosPrimary,
          secondary: cosmosSecondary,
          accent: cosmosAccent,
          dark: cosmosDark,
        },
        "cosmos-primary": withDefault(cosmosPrimary),
        "cosmos-secondary": withDefault(cosmosSecondary),
        "cosmos-accent": withDefault(cosmosAccent),
        "cosmos-dark": withDefault(cosmosDark),
        "cosmos-white": "#FFFFFF",
      },
      aspectRatio: {
        "9/10": "9 / 16",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
