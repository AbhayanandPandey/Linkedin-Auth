import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customOklch: 'oklch(0.53 0.12 266.65)',
      },
    },
  },
  plugins: [react(),tailwindcss()],
})
