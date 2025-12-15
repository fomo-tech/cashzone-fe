// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#48BCF9",
        secondary: "var(--color-secondary)",
      },
      fontFamily: {
        sans: "var(--font-base)",
      },
    },
  },
  plugins: [],
};

export default config;
