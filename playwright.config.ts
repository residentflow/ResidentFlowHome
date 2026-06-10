import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright — Above-the-fold-Abnahmetest (§9.1). Läuft gegen das statische SSG-Build
 * (vite preview). Voraussetzung: installierte Browser (`npx playwright install chromium`);
 * in Umgebungen ohne Zugriff auf die Playwright-CDN bitte in CI mit Browser-Cache ausführen.
 */
export default defineConfig({
  testDir: './e2e-playwright',
  timeout: 30_000,
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173/',
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: 'http://localhost:4173' },
  projects: [
    {
      name: 'desktop-1440x900',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-390x844',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
  ],
});
