import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// add tailwindcss() to the plugins array

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
      }
    },
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: true,
  },
  test: {
    include: ['../tests/client/**/*.test.tsx', '../tests/client/**/*.test.ts'],
    setupFiles: ['../tests/client/setup.ts'],
    environment: 'jsdom',
  },
})
