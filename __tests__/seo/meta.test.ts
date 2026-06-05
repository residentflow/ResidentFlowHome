import { describe, it, expect } from 'vitest';
import { metaFuerRoute } from '@/seo/meta';

const ROUTEN = ['/', '/founder', '/faq', '/impressum', '/datenschutz'] as const;

describe('metaFuerRoute', () => {
  it('jede Route hat Meta-Title und Description', () => {
    for (const pfad of ROUTEN) {
      const meta = metaFuerRoute(pfad);
      expect(meta.title, `Kein Title für ${pfad}`).toBeTruthy();
      expect(meta.title.length, `Title zu kurz für ${pfad}`).toBeGreaterThan(5);
      expect(meta.description, `Keine Description für ${pfad}`).toBeTruthy();
      expect(meta.description.length, `Description zu kurz für ${pfad}`).toBeGreaterThan(10);
    }
  });

  it('jede Route hat Open-Graph- und Twitter-Card-Tags', () => {
    for (const pfad of ROUTEN) {
      const meta = metaFuerRoute(pfad);

      // Open Graph
      expect(meta.og, `Kein og-Objekt für ${pfad}`).toBeDefined();
      expect(meta.og.title, `Kein og.title für ${pfad}`).toBeTruthy();
      expect(meta.og.description, `Keine og.description für ${pfad}`).toBeTruthy();
      expect(meta.og.type, `Kein og.type für ${pfad}`).toBeTruthy();
      expect(meta.og.url, `Keine og.url für ${pfad}`).toBeTruthy();
      expect(meta.og.image, `Kein og.image für ${pfad}`).toBeTruthy();

      // Twitter Card
      expect(meta.twitter, `Kein twitter-Objekt für ${pfad}`).toBeDefined();
      expect(meta.twitter.card, `Kein twitter.card für ${pfad}`).toBeTruthy();
      expect(meta.twitter.title, `Kein twitter.title für ${pfad}`).toBeTruthy();
      expect(meta.twitter.description, `Keine twitter.description für ${pfad}`).toBeTruthy();
    }
  });
});
