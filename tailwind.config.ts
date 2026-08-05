import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14213D",
          light: "#1E2F52",
          dark: "#0D1628",
        },
        parchment: {
          DEFAULT: "#E8E1D0",
          light: "#F2EDE1",
          dark: "#D9CFB6",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#DDBB4C",
          dark: "#9C7D1C",
        },
        moss: {
          DEFAULT: "#3F5343",
          light: "#526C57",
        },
        brick: {
          DEFAULT: "#9B4A3B",
          light: "#B25D4C",
        },
        ivory: "#F5F1E6",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(245,241,230,0.06) 1px, transparent 0)",
      },
      boxShadow: {
        spine: "inset -4px 0 8px rgba(0,0,0,0.35), 2px 2px 6px rgba(0,0,0,0.4)",
        card: "0 8px 24px rgba(20,33,61,0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
