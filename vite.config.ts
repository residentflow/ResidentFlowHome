/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    // Dev: /api an den Fastify-Server (npm run api:dev) durchreichen,
    // sonst beantwortet Vite den Opt-in-POST selbst mit der index.html.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
});
