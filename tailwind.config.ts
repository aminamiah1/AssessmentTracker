import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        customRed: "#e51937",
        customLightRed: "#e5194b",
        customDarkRed: "#ce1732",
      },
      animation: {
        "border-animate": "border-animate 2s linear infinite",
      },
      keyframes: {
        "border-animate": {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "#e5194b" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
