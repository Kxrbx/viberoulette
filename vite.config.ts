import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works both on username.github.io/viberoulette
  // and on a custom domain (e.g. xxx.runs-on.dev).
  base: './',
  plugins: [react()],
})
