// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F97316",
        secondary: "#F59E0B",
      },
      fontFamily: {
        sans: "var(--font-base)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        wiggle: "wiggle 0.5s ease-in-out",
        "slide-in-from-top-2": "slide-in-from-top 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};

export default config;
