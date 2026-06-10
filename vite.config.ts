/// <reference types="vitest" />
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Live-fähige Lösungs-Slugs aus dem Build-Export (Objekt-Gate-gefiltert) für die SSG-Expansion
// der dynamischen Route /loesungen/:slug.
function loesungsRouten(): string[] {
  try {
    const cfg = JSON.parse(
      readFileSync(new URL('./src/generated/check.config.json', import.meta.url), 'utf8'),
    );
    return (cfg.problems ?? []).map((p: { slug: string }) => `/loesungen/${p.slug}`);
  } catch {
    return [];
  }
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  // vite-react-ssg: dynamische Routen müssen explizit aufgelistet werden.
  ssgOptions: {
    includedRoutes: (paths: string[]) => [
      ...paths.filter((p) => !p.includes(':')),
      ...loesungsRouten(),
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    css: false,
  },
});
