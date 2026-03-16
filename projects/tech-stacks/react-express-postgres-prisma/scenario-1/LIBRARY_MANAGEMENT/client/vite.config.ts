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
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app',
      '.ngrok.io',
      '.localhost'
    ],
  },
  test: {
    include: ['../tests/client/**/*.test.tsx', '../tests/client/**/*.test.ts'],
    setupFiles: ['../tests/client/setup.ts'],
    environment: 'jsdom',
  },
})
