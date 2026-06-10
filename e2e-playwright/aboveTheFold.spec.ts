import { test, expect } from '@playwright/test';

/**
 * §9.1 Above-the-fold-Regel (harter Abnahmetest):
 * In beiden Viewports ist [data-testid=role-options] ohne Scrollen vollständig sichtbar,
 * und ein Klick auf eine Rolle rendert die Größenfrage OHNE Navigation (URL unverändert).
 */
test.describe('Above the fold (§9.1)', () => {
  test('Rollen-Frage ist ohne Scrollen vollständig im Viewport', async ({ page }) => {
    await page.goto('/');
    const optionen = page.getByTestId('role-options');
    await expect(optionen).toBeVisible();

    const box = await optionen.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    // Vollständig im ersten Viewport: Unterkante <= Viewport-Höhe, ohne Scroll
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
    // Kein Scroll ausgelöst
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });

  test('Klick auf eine Rolle rendert die Größenfrage ohne Navigation', async ({ page }) => {
    await page.goto('/');
    const urlVorher = page.url();
    await page.getByTestId('role-buyAndHold').click();
    await expect(page.getByTestId('size-options')).toBeVisible();
    expect(page.url()).toBe(urlVorher); // keine Navigation
  });
});
