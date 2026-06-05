import { describe, it, expect } from 'vitest';
import { ROUTEN_ZUM_PRERENDERN, NO_JS_HINWEIS } from '@/prerender';

describe('Prerender-Konfiguration', () => {
  it('listet alle statischen Routen zum Vorrendern', () => {
    expect(Array.isArray(ROUTEN_ZUM_PRERENDERN)).toBe(true);
    expect(ROUTEN_ZUM_PRERENDERN.length).toBeGreaterThan(0);

    // Alle erwarteten Basis-Routen müssen vorhanden sein
    const erwartet = ['/', '/founder', '/faq', '/impressum', '/datenschutz'];
    for (const route of erwartet) {
      expect(
        ROUTEN_ZUM_PRERENDERN,
        `Route "${route}" fehlt in ROUTEN_ZUM_PRERENDERN`,
      ).toContain(route);
    }
  });

  it('die CMS-Route /admin ist NICHT in der Prerender-Liste', () => {
    expect(ROUTEN_ZUM_PRERENDERN).not.toContain('/admin');
    // Kein Eintrag darf mit /admin beginnen
    const adminRouten = ROUTEN_ZUM_PRERENDERN.filter((r) => r.startsWith('/admin'));
    expect(adminRouten).toHaveLength(0);
  });

  it('stellt einen No-JS-Hinweis für die Suche bereit', () => {
    expect(typeof NO_JS_HINWEIS).toBe('string');
    expect(NO_JS_HINWEIS.length).toBeGreaterThan(10);
    // Muss verständlich auf die JS-Abhängigkeit hinweisen
    expect(NO_JS_HINWEIS.toLowerCase()).toMatch(/javascript|js|browser/i);
  });
});
