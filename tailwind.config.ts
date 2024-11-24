import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1e6f9f",
        secondary: "#8284fa",
        tertiary: "#808080",
        surface: "#333333",
        grey: "#808080",
      },
    },
  },
  plugins: [],
} satisfies Config;
