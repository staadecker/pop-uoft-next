module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
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
};