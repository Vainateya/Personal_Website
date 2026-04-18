import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        prussian: "var(--prussian)",
        stone: "var(--stone)",
        ivory: "var(--ivory)",
        "warm-grey": "var(--warm-grey)",
        mist: "var(--mist)",
        border: "var(--border)",
        "admin-ivory": "var(--admin-ivory)"
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["ui-sans-serif", "system-ui", "sans-serif"]
      },
      maxWidth: {
        content: "680px"
      },
      spacing: {
        section: "56px",
        card: "24px"
      },
      letterSpacing: {
        editorial: "-0.3px",
        label: "0.1em"
      },
      borderRadius: {
        editorial: "4px"
      },
      opacity: {
        80: "0.8"
      }
    }
  },
  plugins: []
};

export default config;
