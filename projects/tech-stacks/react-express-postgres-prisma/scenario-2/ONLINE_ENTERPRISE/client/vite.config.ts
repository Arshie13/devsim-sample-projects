import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_PORT ?? process.env.PORT ?? 5173),
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: true,
  },
});
