import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// add tailwindcss() to the plugins array

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
test: {
  include: ['../tests/client/**/*.test.tsx', '../tests/client/**/*.test.ts'],
  setupFiles: ['../tests/client/setup.ts'],
  environment: 'jsdom',
}
  },
})
