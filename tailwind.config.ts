import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#F8FAFC",
        ink: "#0F172A",
        accent: "#0EA5E9",
        success: "#16A34A",
        danger: "#DC2626"
      }
    }
  },
  plugins: []
};

export default config;
