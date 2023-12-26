/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      surface: "var(--md-sys-color-surface-container-low)",
      background: "#f5f2d0",
    },
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [],
}

