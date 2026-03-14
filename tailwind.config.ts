import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
    colors: {
      brandBlue: "#2563eb",
      brandOrange: "#f97316",
      brandYellow: "#eab308",
      brandGreen: "#22c55e",
    }
  }
},
  plugins: [],
}

export default config