import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#1C3F4E", 700: "#15313D", 50: "#EEF3F5" },
        teal: { DEFAULT: "#336D6E", 600: "#2B5D5E" },
        mist: { DEFAULT: "#8CC0C7", 100: "#E6F1F2", 50: "#F3F8F8" },
        line: "#D9E6E8",
        ink: { DEFAULT: "#1C3F4E", soft: "#4E6B75", faint: "#7D949B" },
      },
      fontFamily: { sans: ["Cairo", "system-ui", "sans-serif"] },
      boxShadow: { lift: "0 1px 2px rgba(28,63,78,.06), 0 8px 24px -12px rgba(28,63,78,.18)" },
    },
  },
  plugins: [],
} satisfies Config;
