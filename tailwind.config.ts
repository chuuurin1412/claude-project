import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        waveBar: {
          "0%": { transform: "scaleY(0.08)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        waveBar: "waveBar 0.8s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
