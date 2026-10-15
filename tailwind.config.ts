import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF9",
        surface: "#FFFFFF",
        border: "#E7E5E4",
        "text-primary": "#1C1917",
        "text-muted": "#78716C",
        primary: {
          DEFAULT: "#0F766E",
          hover: "#0D9488",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1120px",
      },
      borderRadius: {
        card: "10px",
        button: "8px",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
