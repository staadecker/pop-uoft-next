import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "index.html"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        surface: "var(--md-sys-color-surface-container-low)",
        background: "#f5f2d0",
        primary: "var(--md-sys-color-primary)",
        primarycontainer: "var(--md-sys-color-primary-container)",
        onprimarycontainer: "var(--md-sys-color-on-primary-container)",
      },
    },
  },
  plugins: [],
  important: "#root",
} satisfies Config;
